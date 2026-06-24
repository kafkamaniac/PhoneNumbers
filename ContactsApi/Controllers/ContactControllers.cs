using Microsoft.AspNetCore.Mvc;
using ContactsApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace ContactsApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Требует аутентификации для всех методов

    public class ContactsController : ControllerBase
    {
        private readonly ILogger<ContactsController> _logger;
        private readonly BackupService _backupService;
        private readonly IContactRepository _repository;

        public ContactsController(IContactRepository repository, BackupService backupService, ILogger<ContactsController> logger)
        {
            _repository = repository;
            _backupService = backupService;
            _logger = logger;
        }

        [HttpGet] // Получение всех контактов
        public IEnumerable<Contact> GetAll()
        {
            return _repository.GetAll();
        }

        [HttpGet("{id}")]
        public ActionResult<Contact> GetById(int id) // Получение контакта по ID
        {
            var contact = _repository.GetById(id);
            if (contact == null)
            {
                return NotFound();
            }
            return contact;
        }

        [HttpPost]
        [Authorize(Roles = "admin")] // Только админ
        public ActionResult<Contact> Create(Contact contact) // Создание нового контакта
        {
            _repository.Add(contact); // Добавление контакта

            var userName = User.Identity?.Name ?? "unknown";

            _backupService.CreateBackup(userName, DbVersion.Version);
            _logger.LogInformation("User {User} created contact {Id}", userName, contact.Id);

            DbVersion.Version++;

            return CreatedAtAction(nameof(GetById), new { id = contact.Id }, contact); // Возвращаем 201 с ссылкой на новый ресурс
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Contact contact) // Обновление контакта
        {
            // Проверяем роль из токена, а не из тела запроса
            var isAdmin = User.IsInRole("admin");

            if (!isAdmin) // Только админ может обновлять контакт
            {
                return Forbid("Только администратор может обновлять контакт.");
            }

            var existingContact = _repository.GetById(id); // Получаем существующий контакт
            if (existingContact == null)
            {
                return NotFound();
            }

            // Обновляем только разрешенные поля
            existingContact.FullName = contact.FullName;
            existingContact.Position = contact.Position;
            existingContact.Department = contact.Department;
            existingContact.Building = contact.Building;
            existingContact.OfficeNumber = contact.OfficeNumber;
            existingContact.InternalPhone = contact.InternalPhone;
            existingContact.CityPhone = contact.CityPhone;
            existingContact.MobilePhone = contact.MobilePhone;
            existingContact.Email = contact.Email;

            try
            {
                _repository.Update(existingContact); // Передаем существующий контакт
                var userName = User.Identity?.Name ?? "unknown";

                _backupService.CreateBackup(userName, DbVersion.Version);
                _logger.LogInformation("User {User} updated contact {Id}", userName, id);

                DbVersion.Version++;

                return NoContent();
            }

            catch (Exception ex)
            {
                return StatusCode(500, $"Ошибка при обновлении: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")] // Только админ
        public IActionResult Delete(int id)
        {
            var existingContact = _repository.GetById(id);
            if (existingContact == null)
            {
                return NotFound();
            }

            _repository.Delete(id);

            var userName = User.Identity?.Name ?? "unknown";

            _backupService.CreateBackup(userName, DbVersion.Version);
            _logger.LogInformation("User {User} deleted contact {Id}", userName, id);

            DbVersion.Version++;

            return NoContent();
        }
    }
}