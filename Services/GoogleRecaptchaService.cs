using Newtonsoft.Json;

namespace WatchAnime.Services;

public class GoogleRecaptchaService
{
    private struct IVerifyResponse
    {
        public bool Success { get; set; }
    }

    public readonly string siteKey;
    private readonly string secretKey;


    public GoogleRecaptchaService(IConfiguration configuration)
    {
        siteKey = configuration.GetSection("Google:RecaptchaSiteKey").Value ?? "";
        secretKey = configuration.GetSection("Google:RecaptchaSecretKey").Value ?? "";
    }

    public async Task<bool> VerifyCaptcha(string captcha)
    {
        var client = new HttpClient();
        var formData = new Dictionary<string, string>
        {
            { "secret", secretKey },
            { "response", captcha },
        };

        var content = new FormUrlEncodedContent(formData);

        var response = await client.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);
        if (response.IsSuccessStatusCode)
        {
            var responseData = await response.Content.ReadAsStringAsync();
            var res = JsonConvert.DeserializeObject<IVerifyResponse>(responseData);
            return res.Success;
        }

        return false;
    }
}