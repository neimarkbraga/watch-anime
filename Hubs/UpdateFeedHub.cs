using Google.Apis.Util;
using Microsoft.AspNetCore.SignalR;

namespace WatchAnime.Hubs;

public class UpdateFeedHub : Hub
{

    public static class EventNames
    {
        public const string WatchItemUpdate = "WatchItemUpdate";
        public const string WatchItemDeleted = "WatchItemDeleted";
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (userId != null)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            await base.OnConnectedAsync();
        }
        else Context.Abort();
    }
}