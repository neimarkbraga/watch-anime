using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;

namespace WatchAnime.Services;

public class GoogleAuthService
{
    public readonly GoogleAuthorizationCodeFlow flow;
    public readonly string redirectUri;

    public GoogleAuthService(IConfiguration configuration)
    {
        flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = configuration.GetSection("Google:ClientId").Value,
                ClientSecret = configuration.GetSection("Google:ClientSecret").Value
            },
            Scopes = ["email", "openid", "profile"],
        });
        redirectUri = configuration.GetSection("Google:RedirectUri").Value!;
    }
}