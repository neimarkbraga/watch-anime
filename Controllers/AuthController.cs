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
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;




namespace WatchAnime.Controllers;

[Controller]
[Route("api/[controller]")]
public class AuthController(IConfiguration configuration, MongoDBService mongoDBService, GoogleAuthService googleAuthService) : Controller
{
    public struct ExchangeAuthTokenBody
    {
        public string Code { get; set; }
        public string RedirectUri { get; set; }
    }

    private readonly IConfiguration _configuration = configuration;
    private readonly MongoDBService _mongoDBService = mongoDBService;
    private readonly GoogleAuthService _googleAuthService = googleAuthService;


    [HttpGet("GetGoogleAuthURI")]
    public IActionResult GetGoogleAuthURI([FromQuery] string redirectUri)
    {
        return Json(_googleAuthService.flow.CreateAuthorizationCodeRequest(redirectUri).Build());
    }

    [HttpPost("LoginWithGoogleAuthToken")]
    public async Task<IActionResult> LoginWithGoogleAuthToken([FromBody] ExchangeAuthTokenBody body)
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

        var expiration = DateTime.Now.AddMinutes(120);

        var Sectoken = new JwtSecurityToken(issuer, issuer, claims: claims, expires: expiration, signingCredentials: credentials);

        return Json(new
        {
            accessToken = new JwtSecurityTokenHandler().WriteToken(Sectoken)
        });
    }

    [HttpGet("GetSession")]
    public async Task<IActionResult> GetSession()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId != null)
        {
            var userAcount = await _mongoDBService.collections.UserAccounts.Find(Builders<UserAccount>.Filter.Eq(i => i.Id, userId)).FirstOrDefaultAsync();
            return Json(userAcount);
        }

        return Json(null);
    }
}