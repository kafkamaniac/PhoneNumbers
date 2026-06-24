// Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using ContactsApi.Models;

namespace ContactsApi.Data 
{
    public class ApplicationDbContext : DbContext // Контекст базы данных
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options)
        {
        }

        public DbSet<Contact> Contacts { get; set; } // Таблица контактов

        protected override void OnModelCreating(ModelBuilder modelBuilder) // Настройка модели данных
        {
            base.OnModelCreating(modelBuilder); 

            //настройка преобразования enum в int для MySQL
            modelBuilder.Entity<Contact>() 
                .Property(c => c.Role) 
                .HasConversion<int>(); // Преобразует enum в int

            // Дополнительно: настройка полей с длинными строками
            modelBuilder.Entity<Contact>(entity =>
            {
                entity.Property(e => e.FullName).HasMaxLength(100);
                entity.Property(e => e.Position).HasMaxLength(100);
                entity.Property(e => e.Department).HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Login).HasMaxLength(50);
                entity.Property(e => e.Password).HasMaxLength(100);
            });
        }
    }
}