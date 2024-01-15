using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using WatchAnime.Services;
using WatchAnime.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace WatchAnime.Controllers;

[Controller]
[Route("api/[controller]")]
public class UserAccountController(MongoDBService mongoDBService, GoogleRecaptchaService googleRecaptchaService) : Controller
{
    public struct ICreateAccountBody
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PictureUrl { get; set; }
        public string Captcha { get; set; }
    }

    public struct IUpdateAccountBody
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PictureUrl { get; set; }
    }

    public struct IChangePasswordBody
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }

    private readonly MongoDBService _mongoDBService = mongoDBService;
    private readonly GoogleRecaptchaService _googleRecaptchaService = googleRecaptchaService;


    [HttpPost("CreateAccount")]
    public async Task<IActionResult> CreateAccount([FromBody] ICreateAccountBody body)
    {
        if (string.IsNullOrEmpty(body.Captcha)) return new UnauthorizedObjectResult(new { message = "Captcha is required" });

        var isCaptchaVerified = await _googleRecaptchaService.VerifyCaptcha(body.Captcha);
        if (!isCaptchaVerified) return new UnauthorizedObjectResult(new { message = "Invalid captcha" });

        var existingUserAccount = await _mongoDBService.collections.UserAccounts.Find(Builders<UserAccount>.Filter.Eq(i => i.Email, body.Email)).FirstOrDefaultAsync();
        if (existingUserAccount != null) return new UnauthorizedObjectResult(new { message = "Email already in use" });

        var userAccount = new UserAccount
        {
            Email = body.Email,
            Password = body.Password,
            FirstName = body.FirstName,
            LastName = body.LastName,
            PictureUrl = body.PictureUrl,
        };

        await _mongoDBService.collections.UserAccounts.InsertOneAsync(userAccount);

        userAccount.Password = null;

        return Json(userAccount);
    }

    [Authorize]
    [HttpPost("UpdateAccount")]
    public async Task<IActionResult> UpdateAccount([FromBody] IUpdateAccountBody body)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return new UnauthorizedObjectResult(new { message = "User account not found" });

        var filter = Builders<UserAccount>.Filter.Eq(i => i.Id, userId);
        var update = Builders<UserAccount>.Update
            .Set(i => i.FirstName, body.FirstName)
            .Set(i => i.LastName, body.LastName)
            .Set(i => i.PictureUrl, body.PictureUrl);

        await _mongoDBService.collections.UserAccounts.UpdateOneAsync(filter, update);

        var userAccount = await _mongoDBService.collections.UserAccounts.Find(Builders<UserAccount>.Filter.Eq(i => i.Id, userId)).FirstOrDefaultAsync();

        return Json(userAccount);
    }

    [Authorize]
    [HttpPost("ChangePassword")]
    public async Task<IActionResult> ChangePassword([FromBody] IChangePasswordBody body)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return new UnauthorizedObjectResult(new { message = "User account not found" });

        var userAccount = await _mongoDBService.collections.UserAccounts.Find(Builders<UserAccount>.Filter.Eq(i => i.Id, userId)).FirstOrDefaultAsync();
        if (userAccount == null) return new UnauthorizedObjectResult(new { message = "User account not found" });


        if (!string.IsNullOrEmpty(userAccount.Password) && userAccount.Password != body.OldPassword) return new UnauthorizedObjectResult(new { message = "Old password did not match" });

        var filter = Builders<UserAccount>.Filter.Eq(i => i.Id, userId);
        var update = Builders<UserAccount>.Update
            .Set(i => i.Password, body.NewPassword);

        await _mongoDBService.collections.UserAccounts.UpdateOneAsync(filter, update);

        return Json(new { message = "Password changed" });
    }


}