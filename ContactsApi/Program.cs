using ContactsApi.Data;
using ContactsApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog;
using ContactsApi.Services;


#region логирование
var logPath = Path.Combine(Directory.GetCurrentDirectory(), "logs", "log.txt");

Console.WriteLine("LOG PATH: " + logPath);

Log.Logger = new LoggerConfiguration()
    .WriteTo.File(logPath,
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level}] {Message}{NewLine}{Exception}")
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();

Log.Information("TEST LOG");

#endregion


#region всё остальное

builder.Services.AddSingleton<HashService>(); //хэширование


// Получение ключа для JWT из конфигурации
var tokenKey = builder.Configuration["AppSettings:Token"]
    ?? throw new InvalidOperationException("JWT Token is not configured in appsettings.json");


// Добавьте политику CORS
//CORS (Cross-Origin Resource Sharing) — это механизм безопасности браузера, 
//который позволяет серверам контролировать, какие сторонние веб-страницы 
//(с других доменов, портов или протоколов) 
//могут запрашивать у них ресурсы, например, данные с API.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .WithOrigins("http://localhost:5173", "https://localhost:5173") // Разрешенные источники
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Настройка аутентификации JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        { // Параметры валидации токена
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization(); // Добавление службы авторизации

// MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options => // Настройка контекста базы данных с использованием MySQL
    options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(8, 0, 32))
    )
);

// Репозиторий
builder.Services.AddScoped<IContactRepository, ContactRepository>();

// Контроллеры
builder.Services.AddControllers();

builder.Services.AddSingleton<BackupService>();

// Построение приложения
var app = builder.Build();



/*
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    var users = db.Contacts.ToList();

    foreach (var user in users)
    {
        // если пароль ещё НЕ хэширован
        if (!user.Password.StartsWith("$2"))
        {
            var oldPassword = user.Password;

            user.Password = BCrypt.Net.BCrypt.HashPassword(oldPassword);

            Console.WriteLine($"HASHED: {oldPassword} -> {user.Password}");
        }
    }

    db.SaveChanges();
}
*/

/*
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var hashService = scope.ServiceProvider.GetRequiredService<HashService>();

    var contacts = db.Contacts.ToList();

    foreach (var contact in contacts)
    {
        if (string.IsNullOrEmpty(contact.DataHash))
        {
            contact.DataHash = hashService.ComputeHash(contact);
        }
    }

    db.SaveChanges();
}
*/
//эта штучка нужна была, чтобы обновить DataHash, она осталась в учебных целях




// ПРАВИЛЬНЫЙ ПОРЯДОК MIDDLEWARE
// Сначала CORS
app.UseCors("AllowReactApp");

// Затем проверка БД
app.Use(async (context, next) =>
{
    try
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var canConnect = await dbContext.Database.CanConnectAsync();

        if (!canConnect)
        {
            context.Response.StatusCode = 500;
            await context.Response.WriteAsync("Database connection failed");
            return;
        }
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync($"Database error: {ex.Message}");
        return;
    }

    await next();
});

// Затем аутентификация и авторизация
app.UseAuthentication();
app.UseAuthorization();

// Затем контроллеры
app.MapControllers();

// Простой эндпоинт для проверки работы
app.MapGet("/", () => "Contacts API is running!");

app.Run();


#endregion
