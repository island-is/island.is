using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetCoreDemoApi.Entities;
using NetCoreDemoApi.Interfaces;

namespace NetCoreDemoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HomeController : ControllerBase, IHomeController
    {
        public HomeController() { }

        [HttpGet, Route("")]
        public ReturnObject Test()
        {
            return new ReturnObject("Congratulations, you successfully managed to call this function using island.is Identity Server as your entry point");
        }
    }
}