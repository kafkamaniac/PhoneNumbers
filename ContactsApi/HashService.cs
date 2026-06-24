using System.Security.Cryptography;
using System.Text;
using ContactsApi.Models;

namespace ContactsApi.Services
{
    public class HashService
    {
        private readonly string _secretKey = "SUPER_SECRET_KEY";

        public string ComputeHash(Contact c)
        {
            var raw = $"{c.FullName}|{c.Email}|{c.Department}|{c.MobilePhone}";

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_secretKey));
            var bytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(raw));

            return Convert.ToBase64String(bytes);
        }

        public string ComputeFileHash(string path)
        {
            using var sha = SHA256.Create();
            using var stream = File.OpenRead(path);
            return Convert.ToBase64String(sha.ComputeHash(stream));
        }
    }
}