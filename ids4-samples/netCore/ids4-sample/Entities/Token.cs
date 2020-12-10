namespace ids4_sample.Entities
{
    public class Token
    {
        public string Access_token { get; set; }
        public int Expires_in { get; set; }
        public string Token_type { get; set; }
        public string Scope { get; set; } 
    }
}