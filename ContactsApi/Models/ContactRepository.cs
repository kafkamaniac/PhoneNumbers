using ContactsApi.Models;
using Microsoft.EntityFrameworkCore;
using ContactsApi.Data;
using ContactsApi.Services;
using BCrypt.Net;

namespace ContactsApi.Models
{
    public class ContactRepository : IContactRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly HashService _hashService;


        public ContactRepository(ApplicationDbContext db, HashService hashService)
        {
            _db = db;
            _hashService = hashService;
        }

        public IEnumerable<Contact> GetAll()
        {
            return _db.Contacts.AsNoTracking().ToList();
        }

        //ХЭШ
        public Contact? GetById(int id)
        {
            var contact = _db.Contacts.Find(id);

            if (contact == null) return null;

            var currentHash = _hashService.ComputeHash(contact);

            if (contact.DataHash != currentHash)
            {
                Console.WriteLine($"ДАННЫЕ ИЗМЕНЕНЫ! ID={id}");
            }

            return contact;
        }


        public void Add(Contact contact)
        {
            contact.DataHash = _hashService.ComputeHash(contact);

            contact.Password = BCrypt.Net.BCrypt.HashPassword(contact.Password);
            Console.WriteLine("HASHED: " + contact.Password);

            _db.Contacts.Add(contact);
            _db.SaveChanges();
        }

        public void Update(Contact contact)
        {
            {
                contact.DataHash = _hashService.ComputeHash(contact);

                if (!contact.Password.StartsWith("$2"))
                {
                    contact.Password = BCrypt.Net.BCrypt.HashPassword(contact.Password);
                }

                _db.Entry(contact).State = EntityState.Modified;
                _db.SaveChanges();
            }

        }

        public void Delete(int id)
        {
            var contact = _db.Contacts.Find(id);
            if (contact == null) return;

            _db.Contacts.Remove(contact);
            _db.SaveChanges();
        }
    }
}