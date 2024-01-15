using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WatchAnime.Models;

public class WatchItem
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string? UserId { get; set; }
    public string? Code { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int? LastSeenEpisode { get; set; }
}