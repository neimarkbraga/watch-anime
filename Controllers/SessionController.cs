using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using WatchAnime.Services;
using WatchAnime.Models;
using System.Security.Claims;

namespace WatchAnime.Controllers;

[Controller]
[Route("api/[controller]")]
public class SessionController(MongoDBService mongoDBService, GoogleAuthService googleAuthService, GoogleRecaptchaService googleRecaptchaService) : Controller
{
    public struct ISessionUser
    {
        public string Id { get; set; }
        public string GoogleId { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PictureUrl { get; set; }
    }

    public struct ISessionConfig
    {
        public string GoogleClientId { get; set; }
        public string GoogleRecaptchaSiteKey { get; set; }
    }

    public struct ISession
    {
        public ISessionUser? User { get; set; }
        public ISessionConfig Config { get; set; }
    }


    private readonly MongoDBService _mongoDBService = mongoDBService;
    private readonly GoogleAuthService _googleAuthService = googleAuthService;
    private readonly GoogleRecaptchaService _googleRecaptchaService = googleRecaptchaService;

    [HttpGet("GetSession")]
    public async Task<ISession> GetSession()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var session = new ISession
        {
            User = null,
            Config = new ISessionConfig
            {
                GoogleClientId = _googleAuthService.clientId,
                GoogleRecaptchaSiteKey = _googleRecaptchaService.siteKey
            }
        };

        if (userId != null)
        {
            var userAcount = await _mongoDBService.collections.UserAccounts.Find(Builders<UserAccount>.Filter.Eq(i => i.Id, userId)).FirstOrDefaultAsync();
            if (userAcount != null)
            {
                session.User = new ISessionUser
                {
                    Id = userAcount.Id ?? "",
                    GoogleId = userAcount.GoogleId ?? "",
                    Email = userAcount.Email ?? "",
                    FirstName = userAcount.FirstName ?? "",
                    LastName = userAcount.LastName ?? "",
                    PictureUrl = userAcount.PictureUrl ?? ""
                };
            }
        }

        return session;
    }
}