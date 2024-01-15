using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;

namespace WatchAnime.Services;

public class GoogleAuthService
{
    public readonly GoogleAuthorizationCodeFlow flow;
    public readonly string clientId;
    private readonly string clientSecret;


    public GoogleAuthService(IConfiguration configuration)
    {
        clientId = configuration.GetSection("Google:ClientId").Value ?? "";
        clientSecret = configuration.GetSection("Google:ClientSecret").Value ?? "";

        flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets { ClientId = clientId, ClientSecret = clientSecret },
            Scopes = ["email", "openid", "profile"],
        });
    }
}