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
        public async Task<ReturnObject> Test()
        {
            var tokenObject = await createTokenHelper.GetToken();

            using HttpClient httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(configuration.GetValue<string>("Token:BaseUrl"));
            httpClient.DefaultRequestHeaders.Accept.Clear();
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", tokenObject.Access_token);

            var response = await httpClient.GetAsync(configuration.GetValue<string>("TargetServiceUrl"));
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadAsStringAsync();
                var resultObj = JsonConvert.DeserializeObject<DemoApiResult>(result);

                return new ReturnObject(tokenObject, resultObj);
            }

            throw new Exception("Unfortunately, this call has failed");
        }
    }
}