using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WatchAnime.Models;

public class UserAccount
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string? GoogleId { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PictureUrl { get; set; }
    public string? Password { get; set; }
}
