using System.Collections.Generic;

namespace ContactsApi.Models
{
    public interface IContactRepository 
    {
        IEnumerable<Contact> GetAll(); 
        Contact? GetById(int id); 
        void Add(Contact contact);
        void Update(Contact contact);
        void Delete(int id);
    }
}