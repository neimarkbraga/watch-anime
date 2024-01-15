using WatchAnime.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace WatchAnime.Services;

public class MongoDBService
{
    public struct Collections
    {
        public IMongoCollection<WatchItem> WatchItems;
        public IMongoCollection<UserAccount> UserAccounts;
    }

    public readonly Collections collections;

    public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings)
    {
        MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
        IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        collections = new Collections
        {
            WatchItems = database.GetCollection<WatchItem>("watch_items"),
            UserAccounts = database.GetCollection<UserAccount>("user_accounts")
        };
    }
}