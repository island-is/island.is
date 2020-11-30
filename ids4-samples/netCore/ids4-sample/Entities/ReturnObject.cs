namespace ids4_sample.Entities
{
    public class ReturnObject
    {
        public ReturnObject(
            Token tokenData, DemoApiResult result
        ) {
            Success = true;
            ClientCredentialsToken = tokenData;
            SampleApiResult = result;
        }

        public bool Success { get; set; }
        public Token ClientCredentialsToken { get; set; }
        public DemoApiResult SampleApiResult { get; set; }
    }
}