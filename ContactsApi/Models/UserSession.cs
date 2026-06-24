namespace ContactsApi.Models
{
    public class UserSession
    {
        public string? Token { get; set; } = string.Empty;

        public int UserId { get; set; }
        public DateTime LastActivity { get; set; } = DateTime.Now;

        public static class SessionManager
        {
            public static Dictionary<string, UserSession> Sessions { get; } = new();
        }
    }
}