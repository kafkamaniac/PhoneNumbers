namespace ContactsApi.Models

{
    using System.ComponentModel.DataAnnotations.Schema;

    public class Contact
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Building { get; set; } = string.Empty;
        public string OfficeNumber { get; set; } = string.Empty;
        public string InternalPhone { get; set; } = string.Empty;
        public string CityPhone { get; set; } = string.Empty;
        public string MobilePhone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        public UserRole Role { get; set; } = UserRole.user;
        public string DataHash { get; set; } = string.Empty;
    }
}
