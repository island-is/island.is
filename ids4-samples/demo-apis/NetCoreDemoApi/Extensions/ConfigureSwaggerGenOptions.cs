using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace NetCoreDemoApi.Extensions
{
    public class ConfigureSwaggerGenOptions: IConfigureOptions<SwaggerGenOptions>
    {
        public IConfiguration Configuration { get; }

        public ConfigureSwaggerGenOptions(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void Configure(SwaggerGenOptions c)
        {
            c.OperationFilter<AuthorizeOperationFilter>();
            c.AddSecurityDefinition("OAuth2", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.OAuth2,
                Flows = new OpenApiOAuthFlows()
                {
                    AuthorizationCode = new OpenApiOAuthFlow()
                    {
                        AuthorizationUrl = new Uri(
                            $"{Configuration.GetValue<string>("SwaggerAuthorization:Authority")}{Configuration.GetValue<string>("SwaggerAuthorization:AuthorizationPostfix")}"
                        ),
                        TokenUrl = new Uri(
                            $"{Configuration.GetValue<string>("SwaggerAuthorization:Authority")}{Configuration.GetValue<string>("SwaggerAuthorization:TokenPostfix")}"
                        ),
                        Scopes = new Dictionary<string, string>
                        {
                            {
                                Configuration.GetValue<string>("SwaggerAuthorization:Scopes"),
                                "Sækir OpenId, Profile og claimið sem þarf"
                            }
                        }
                    }
                }
            });
        }
    }
}