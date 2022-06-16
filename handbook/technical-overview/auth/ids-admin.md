
# IAS Admin interface
When users want to start using IAS they are provided with a document to fill out. We use this information to create clients and/or scopes and resources in the admin interface. Below are descriptions of these terms so you can provide us with accurate information along with what information we need and why.

## Client

An application making protected resource requests on behalf of a resource owner (such as a user). The clients represent applications that can request tokens from the IAS.
### Creating clients
To create a client we need the following information: 
 - Your application domain (such as _island.is_)
 - Name of the application
	 - The name and domain are used to determine the client id. The name is also what users see when they are using the authentication service.
 - Callback URLs
	 - IAS compares these URLs with the callback URL sent with the request to the authorize endpoint. The callback URL sent with the request needs to match the URLs registered in IAS.
 - Post logout redirect URLs
	 - These URLs are compared with the `post_logout_redirect_uri` sent when client ends a session. The URL in the request must match the URLs registered in IAS. The post logout redirect URL is the URL the user will be redirected to after signing out.
 - The application's technical stack
 - Whether the authentication is done client or server-side
 - If the stack supports PKCE
	 - PKCE stands for Proof key for code exchange. It is an extension of the authorization code flow to prevent CSRF and injection attacks.
 - Whether you want national id (kennitala) and name in the id_token or fetch it through /connect/userinfo endpoint or some other way.
 - If you have any web services that need island.is authentication.
	 - If you need island.is authentication for your web services a resource and scopes are required.
When we have this information we create the client and then give you the clientId and secret (the secret is not always used).

## Resources and Scopes

 - Scope
	 - Scopes are used to limit access to the resources such as API endpoints. An example of scope is `@myorg.is/documents` that represents access to documents from a Document API. Scopes can be even more specific for example `@myorg.is/documents:read` and `@myorg.is/documents:write` which grant access to either read or write documents in a Document API.
 - Resource
	 - A resource is something you want to protect with IAS (such as API) and has one or more scopes. Only one scope is needed when the API access is always the same. An example of that is the resource calendar with the scope calendar. An example of a resource with multiple scopes is a calendar resource with scopes calendar.read and calendar.write. These two scopes represent different levels of access to the calendar API and are grouped together by the resource.

### Creating resources and scopes

Usually, we create a client and then resources and scopes if needed and grant the client access to them.
Sometimes you might only want resources and scopes created for you and don´t need a client. An example use case is when you want to use [island.is](http://island.is/) app to log in and when the user is logged in there they will be able to access your API. Regardless, the process is the same. We need:

 - Name of the web service
 - Whether the web service is requires access control by nationalId (kennitölu stýringu)
 - If the scope should add national id (kennitala) of the user to the access_token
 - If you have multiple access levels for your web service, you´ll need to provide them all with a description of what they do.

An example of how to use scopes can be found [here](https://docs.devland.is/technical-overview/auth/configuration#example-authentication).
