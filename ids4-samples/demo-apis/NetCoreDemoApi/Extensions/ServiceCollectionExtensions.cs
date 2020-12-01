using Microsoft.Extensions.DependencyInjection;
using NetCoreDemoApi.Controllers;
using NetCoreDemoApi.Interfaces;

namespace NetCoreDemoApi.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddTransient<IHomeController, HomeController>();
        }
    }
}