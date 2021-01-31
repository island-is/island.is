# Client types

Tegundir biðlara geta verið einhverjar af eftirfarandi

### <a name="spa"></a>Single Page App

_Authorization code flow + PKCE_  
A single-page application (spa) doesn't need to reload the page during its use and works within a browser, e.g. Facebook. Since it is running in the users browser, it cannot keep a secret.

### <a name="native"></a>Native

_Authorization code flow + PKCE_
A native application is designed specifically for use on a particular platform or device. Since it runs on user´s devices it cannot keep a secret

### <a name="web"></a>Web App

_Hybrid flow with client authentication_
A web application runs on a web server and is accessed by a web browser. Examples of common web applications are online banking and online retail sales. Is capable of keeping a secret

### <a name="machine"></a>Machine

_Hybrid flow with client authentication_
An application or service running on a confidential server. This type of application is capable of keeping a secret
