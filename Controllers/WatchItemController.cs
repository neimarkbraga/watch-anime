using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WatchAnime.Services;
using WatchAnime.Models;
using MongoDB.Driver;


namespace WatchAnime.Controllers;

[Authorize]
[Controller]
[Route("api/[controller]")]
public class WatchItemController(MongoDBService mongoDBService) : Controller
{
    public struct ICreateWatchItemBody
    {
        public string Code { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int LastSeenEpisode { get; set; }
    }

    public struct IUpdateWatchItemBody
    {
        public string Code { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int LastSeenEpisode { get; set; }
    }

    private readonly MongoDBService _mongoDBService = mongoDBService;

    [HttpGet]
    public async Task<List<WatchItem>> GetWatchItems()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return await _mongoDBService.collections.WatchItems.Find(Builders<WatchItem>.Filter.Eq(i => i.UserId, userId)).ToListAsync();
    }

    [HttpPost]
    public async Task<IActionResult> CreateWatchItem([FromBody] ICreateWatchItemBody body)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var watchItem = new WatchItem
        {
            UserId = userId,
            Code = body.Code,
            Title = body.Title,
            Description = body.Description,
            LastSeenEpisode = body.LastSeenEpisode
        };

        await _mongoDBService.collections.WatchItems.InsertOneAsync(watchItem);

        return CreatedAtAction(nameof(GetWatchItems), new { id = watchItem.Id }, watchItem);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWatchItem(string id, [FromBody] IUpdateWatchItemBody body)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var filter = Builders<WatchItem>.Filter.Eq(i => i.Id, id) & Builders<WatchItem>.Filter.Eq(i => i.UserId, userId);
        var update = Builders<WatchItem>.Update
            .Set(i => i.Code, body.Code)
            .Set(i => i.Title, body.Title)
            .Set(i => i.Description, body.Description)
            .Set(i => i.LastSeenEpisode, body.LastSeenEpisode);
        await _mongoDBService.collections.WatchItems.UpdateOneAsync(filter, update);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWatchItem(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var filter = Builders<WatchItem>.Filter.Eq(i => i.Id, id) & Builders<WatchItem>.Filter.Eq(i => i.UserId, userId);
        await _mongoDBService.collections.WatchItems.DeleteOneAsync(filter);
        return NoContent();
    }
}