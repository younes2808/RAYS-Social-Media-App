using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ServerAPI.DAL;
using Microsoft.Extensions.FileProviders; // Add this line
using System.IO; // Make sure to include this if not already present

var builder = WebApplication.CreateBuilder(args);

// Configure the database context
builder.Services.AddDbContext<ServerAPIContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder.WithOrigins("http://localhost:3000") // Replace with your React app URL in production
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// Add Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ServerAPI", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ServerAPI v1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at app's root
    });
}

// Use CORS
app.UseCors("AllowReactApp");

string imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "PostImages");
if (!Directory.Exists(imagesPath))
{
    Directory.CreateDirectory(imagesPath);
}


// Enable serving static files from the PostImages directory
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "PostImages")),
    RequestPath = "/PostImages" // The URL path to access images
});

// Add authorization middleware
app.UseAuthorization();

// Map controllers
app.MapControllers();

app.Run();
