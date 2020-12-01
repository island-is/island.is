namespace NetCoreDemoApi.Entities
{
    public class ReturnObject
    {
        public ReturnObject(string message)
        {
            Success = true;
            Message = message;
        }

        public bool Success { get; set; }
        public string Message { get; set; }
    }
}