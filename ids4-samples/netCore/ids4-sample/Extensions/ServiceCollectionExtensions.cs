using ids4_sample.Controllers;
using ids4_sample.Helpers;
using ids4_sample.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace ids4_sample.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddTransient<IHomeController, HomeController>();
            services.AddTransient<ICreateToken, CreateToken>();
        }
    }
}