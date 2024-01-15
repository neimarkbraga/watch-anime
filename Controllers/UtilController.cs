using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WatchAnime.Controllers;

[Authorize]
[Controller]
[Route("api/[controller]")]
public class UtilController() : Controller
{
    private readonly HttpClient httpClient = new HttpClient();

    [HttpGet("GetHtmlContent")]
    public async Task<IActionResult> GetHtmlContent([FromQuery] string url)
    {
        var response = await httpClient.GetAsync(url);
        if (response.IsSuccessStatusCode)
        {
            string htmlContent = await response.Content.ReadAsStringAsync();
            return Json(htmlContent);
        }
        return Json("");
    }
}