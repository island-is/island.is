using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ids4_sample.Entities;
using ids4_sample.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace ids4_sample.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase, IHomeController
    {
        private readonly ICreateToken createTokenHelper;
        private readonly IConfiguration configuration;

        public HomeController(
            ICreateToken createTokenHelper,
            IConfiguration configuration
        )
        {
            this.createTokenHelper = createTokenHelper;
            this.configuration = configuration;
        }

        [HttpGet, Route("")]
        public async Task<ReturnObject> GetMessage()
        {
            // Get a token so we can talk to the demo service
            var token = await createTokenHelper.GetToken();

            // return await ReturnObjectHelper(token, configuration.GetValue<string>("NestJsDemoFunction")); // Demo NestJS Api function
            return await ReturnObjectHelper(token, configuration.GetValue<string>("NetCoreDemoFunction")); // Demo .NetCore Api function
        }

        private async Task<ReturnObject> ReturnObjectHelper(Token token, string serviceUri)
        {
            using HttpClient httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Accept.Clear();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token.Access_token);

            var response = await httpClient.GetAsync(serviceUri);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                var resultObj = JsonConvert.DeserializeObject<DemoApiResult>(result);

                return new ReturnObject(token, resultObj);
            }

            throw new Exception("Unfortunately, this call has failed");
        }
    }
}