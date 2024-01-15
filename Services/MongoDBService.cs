using WatchAnime.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace WatchAnime.Services;

public class MongoDBService
{
    public struct ICollections
    {
        public IMongoCollection<WatchItem> WatchItems;
        public IMongoCollection<UserAccount> UserAccounts;
    }

    public readonly ICollections collections;

    public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings)
    {
        MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        collections = new ICollections
        {
            WatchItems = database.GetCollection<WatchItem>("watch_items"),
            UserAccounts = database.GetCollection<UserAccount>("user_accounts")
        };
    }
}