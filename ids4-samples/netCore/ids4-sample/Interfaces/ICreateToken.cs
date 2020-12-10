using System.Threading.Tasks;
using ids4_sample.Entities;

namespace ids4_sample.Interfaces
{
    public interface ICreateToken
    {
        Task<Token> GetToken();
    }
}