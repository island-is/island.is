process.env.PORT = '3010'
process.env.BFF_NAME = 'testclient'
process.env.BFF_CACHE_USER_PROFILE_TTL_MS = '3595000' // 1 hour - 5 seconds
process.env.BFF_LOGIN_ATTEMPT_TTL_MS = '604800000' // 1 week
process.env.IDENTITY_SERVER_CLIENT_SECRET = 'some secret'
process.env.IDENTITY_SERVER_ISSUER_URL = 'https://identity-server.dev01.devland.is'
process.env.IDENTITY_SERVER_CLIENT_SCOPES = '["testscope"]'
process.env.IDENTITY_SERVER_CLIENT_ID = '@test_client_id'
process.env.BFF_PAR_SUPPORT_ENABLED = 'false'

process.env.BFF_GLOBAL_PREFIX = '/testclient/bff'
process.env.BFF_CLIENT_BASE_PATH = '/testclient'
process.env.BFF_CLIENT_BASE_URL = 'http://test-client.com'
process.env.BFF_ALLOWED_REDIRECT_URIS = '["http://test-client.com/testclient"]'
process.env.BFF_ALLOWED_EXTERNAL_API_URLS = '["https://api.external.com"]'
process.env.BFF_CALLBACKS_BASE_PATH =
  'http://localhost:3010/testclient/bff/callbacks'
process.env.BFF_LOGOUT_REDIRECT_URI = 'http://localhost:4200/testclient'
process.env.BFF_PROXY_API_ENDPOINT = 'http://localhost:4444/api/graphql'
process.env.BFF_TOKEN_SECRET_BASE64 =
  'Y0ROrC3mxDBnveN+EpAnLtSubttyjZZWcV43dyk7OQI='
