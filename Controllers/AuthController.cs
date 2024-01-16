using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Google.Apis.Services;
using Google.Apis.Oauth2.v2;
using Google.Apis.Auth.OAuth2;
using MongoDB.Driver;
using WatchAnime.Services;
using WatchAnime.Models;

namespace WatchAnime.Controllers;

[Controller]
[Route("api/[controller]")]
public class AuthController(IConfiguration configuration, MongoDBService mongoDBService, GoogleAuthService googleAuthService, GoogleRecaptchaService googleRecaptchaService) : Controller
{
    public struct ILoginWithGoogleAuthTokenBody
    {
        public string Code { get; set; }
        public string RedirectUri { get; set; }
    }

    public struct ILoginWithEmailAndPasswordBody
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Captcha { get; set; }
    }

    private readonly IConfiguration _configuration = configuration;
    private readonly MongoDBService _mongoDBService = mongoDBService;
    private readonly GoogleAuthService _googleAuthService = googleAuthService;
    private readonly GoogleRecaptchaService _googleRecaptchaService = googleRecaptchaService;


    [HttpGet("GetGoogleAuthURI")]
    public IActionResult GetGoogleAuthURI([FromQuery] string redirectUri)
    {
        return Json(_googleAuthService.flow.CreateAuthorizationCodeRequest(redirectUri).Build());
    }

    [HttpPost("LoginWithGoogleAuthToken")]
    public async Task<IActionResult> LoginWithGoogleAuthToken([FromBody] ILoginWithGoogleAuthTokenBody body)
    {
        var token = _googleAuthService.flow.ExchangeCodeForTokenAsync("", body.Code, body.RedirectUri, CancellationToken.None).Result;
        var credential = new UserCredential(_googleAuthService.flow, "", token);

        var oauth2Service = new Oauth2Service(new BaseClientService.Initializer { HttpClientInitializer = credential });
        var userInfo = oauth2Service.Userinfo.Get().Execute();

        var userAccount = await _mongoDBService.collections.UserAccounts.Find(Builders<UserAccount>.Filter.Eq(i => i.GoogleId, userInfo.Id)).FirstOrDefaultAsync();

        if (userAccount == null)
        {
            userAccount = new UserAccount
            {
                GoogleId = userInfo.Id ?? "",
                Email = userInfo.Email ?? "",
                FirstName = userInfo.GivenName ?? "",
                LastName = userInfo.FamilyName ?? "",
                PictureUrl = userInfo.Picture ?? "",
            };

            await _mongoDBService.collections.UserAccounts.InsertOneAsync(userAccount);
        }

        return Json(new { accessToken = CreateToken(userAccount) });
    }

    [HttpPost("LoginWithEmailAndPassword")]
    public async Task<IActionResult> LoginWithEmailAndPassword([FromBody] ILoginWithEmailAndPasswordBody body)
    {

        if (string.IsNullOrEmpty(body.Captcha)) return new UnauthorizedObjectResult(new { message = "Captcha is required" });

        var isCaptchaVerified = await _googleRecaptchaService.VerifyCaptcha(body.Captcha);
        if (!isCaptchaVerified) return new UnauthorizedObjectResult(new { message = "Invalid captcha" });

        var userAccount = await _mongoDBService.collections.UserAccounts.Find(Builders<UserAccount>.Filter.Eq(i => i.Email, body.Email)).FirstOrDefaultAsync();
        if (userAccount == null) return new UnauthorizedObjectResult(new { message = "Email does not exist" });

        if (string.IsNullOrEmpty(userAccount.Password) || body.Password != userAccount.Password) return new UnauthorizedObjectResult(new { message = "Invalid password" });

        return Json(new { accessToken = CreateToken(userAccount) });
    }

    private string CreateToken(UserAccount userAccount)
    {
        var issuer = _configuration.GetSection("Jwt:Issuer").Value!;
        var secretKey = _configuration.GetSection("Jwt:SecretKey").Value!;

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<System.Security.Claims.Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userAccount.Id!),
            new(JwtRegisteredClaimNames.Email, userAccount.Email!),
            new(JwtRegisteredClaimNames.GivenName, userAccount.FirstName!),
            new(JwtRegisteredClaimNames.FamilyName, userAccount.LastName!),
        };

        var expiration = DateTime.Now.AddDays(1);

        var Sectoken = new JwtSecurityToken(issuer, issuer, claims: claims, expires: expiration, signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(Sectoken);
    }
}