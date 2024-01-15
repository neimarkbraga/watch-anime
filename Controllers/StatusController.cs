using Microsoft.AspNetCore.Mvc;

namespace WatchAnime.Controllers;

[Controller]
[Route("api/[controller]")]
public class StatusController : Controller
{

    [HttpGet]
    public IActionResult Get()
    {
        return Json(new
        {
            active = true
        });
    }
}