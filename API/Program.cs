using dotenv.net;
using MongoDB.Bson;
using MongoDB.Driver;

DotEnv.Load();//Carrega as variaveis do .env

String? connectionString = Environment.GetEnvironmentVariable("URI");

if (connectionString != null) //verifica se variavel de ambiente URI existe
{
    var client = new MongoClient(connectionString);
    var ggviewdb = client.GetDatabase("ggview");
    var coll_db = ggviewdb.ListCollectionNames().ToList();
    coll_db.ForEach(name => Console.WriteLine(name));
} 
else
{
    Console.BackgroundColor = ConsoleColor.Red;
    Console.WriteLine("Variável de ambiente inexistente. Configure um .env.");
    Console.ResetColor();
}


// var builder = WebApplication.CreateBuilder(args);

// // Add services to the container.
// // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// builder.Services.AddOpenApi();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// var app = builder.Build();

// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.MapOpenApi();
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();

// var summaries = new[]
// {
//     "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
// };

// app.MapGet("/weatherforecast", () =>
// {
//     var forecast =  Enumerable.Range(1, 5).Select(index =>
//         new WeatherForecast
//         (
//             DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
//             Random.Shared.Next(-20, 55),
//             summaries[Random.Shared.Next(summaries.Length)]
//         ))
//         .ToArray();
//     return forecast;
// })
// .WithName("GetWeatherForecast");

// app.Run();

// record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
// {
//     public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
// }
