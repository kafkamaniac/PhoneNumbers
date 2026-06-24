using Microsoft.AspNetCore.Mvc;
using ContactsApi.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace ContactsApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IContactRepository _repository;
        private readonly IConfiguration _configuration;

        #region логирование
        private readonly ILogger<AuthController> _logger;

        public AuthController(IContactRepository repository, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _repository = repository;
            _configuration = configuration;
            _logger = logger;
        }
        #endregion


        #region выкидывалка

        static int counter = 5; //счётчик для ввода пароля
        static DateTime? lockoutEnd = null; // время окончания блокировки

        //выкидывалка


        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {

            _logger.LogInformation("Попытка входа: {Login}", request.Login); //ЛОГИРОВАНИЕ

            if (string.IsNullOrEmpty(request.Login) || string.IsNullOrEmpty(request.Password))

                return BadRequest("Логин и пароль обязательны");




            if (lockoutEnd.HasValue && lockoutEnd > DateTime.Now)
            {
                var remainingLockout = lockoutEnd.Value - DateTime.Now;
                return BadRequest(new { message = $"Попробуйте снова через {Math.Ceiling(remainingLockout.TotalSeconds)} секунд." });


            }

            var user = _repository.GetAll()
    .FirstOrDefault(c => c.Login == request.Login);


            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                counter--;

                if (counter <= 0)
                {
                    lockoutEnd = DateTime.Now.AddSeconds(30); 
                }

                int attemptsLeft = counter <= 0 ? 0 : counter;

                if (counter <= 0)
                {
                    counter = 5; 
                }
                return Unauthorized(new { message = $"Неверный логин или пароль. У вас осталось {attemptsLeft} попыток.", info = "Все данные пользователей защищены. Используется шифрование и блокировка после нескольких неудачных попыток." });

            }



            var token = CreateToken(user); // Создание JWT токена

            UserSession.SessionManager.Sessions[token] = new UserSession
            {
                Token = token,
                UserId = user.Id,
                LastActivity = DateTime.Now
            }; //создание сессии пользователя

            return Ok(new
            {
                fullName = user.FullName,
                role = user.Role == UserRole.admin ? 1 : 0,
                token = token

            });
        }



        //для таймера
        public static void Count(object obj)
        {
            int x = (int)obj;
            for (int i = 1; i < 9; i++, x++)
            {
                //ждём пока закончатся 5 попыток, потом обнуляем счётчик и разрешаем вводить пароль снова
            }
        }
        private string CreateToken(Contact user)
        {
            var tokenKey = _configuration["AppSettings:Token"];
            if (string.IsNullOrEmpty(tokenKey))
                throw new InvalidOperationException("JWT token key is not configured");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Login),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }


    public class LoginRequest
    {
        public string? Login { get; set; }
        public string? Password { get; set; }
    }
}

        #endregion