using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ids4_sample.Entities;
using ids4_sample.Interfaces;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace ids4_sample.Helpers
{
    public class CreateToken: ICreateToken
    {
        private readonly IConfiguration configuration;

        public CreateToken(
            IConfiguration configuration
        ) {
            this.configuration = configuration;
        }

        public async Task<Token> GetToken()
        {
            using HttpClient httpClient = new HttpClient();
            
            httpClient.BaseAddress = new Uri(configuration.GetValue<string>("Token:BaseUrl"));
            httpClient.DefaultRequestHeaders.Accept.Clear();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var parameters = new Dictionary<string, string> {
                { "grant_type", configuration.GetValue<string>("Token:GrantType") },
                { "client_id", configuration.GetValue<string>("Token:ClientId") },
                { "client_secret", configuration.GetValue<string>("Token:ClientSecret") },
                { "scope", configuration.GetValue<string>("Token:Scope") }
            };
            var response = await httpClient.PostAsync(configuration.GetValue<string>("Token:ConnectUrl"), new FormUrlEncodedContent(parameters));
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<Token>(result);
            }

            throw new Exception($"Error getting data. Status Code: {response.StatusCode}.");
        }
    }
}