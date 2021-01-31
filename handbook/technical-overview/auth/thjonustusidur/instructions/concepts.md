# Concepts

Hér má sjá yfirlit yfir hugtök sem tengjast OAuth2 staðlinum, IdentityServer4 og auðkenningarþjónustu 
island.is

### <a name="oauth"></a>OAuth 2

OAuth2 eru staðall sem setur reglur um það hvernig á að veita heimildir.  
Lesa má nánar um OAuth með eftirfarandi hlekkjum  
[https://tools.ietf.org/html/rfc6749](https://tools.ietf.org/html/rfc6749)  
[https://auth0.com/docs/protocols/protocol-oauth2#roles](https://auth0.com/docs/protocols/protocol-oauth2#roles)

### <a name="openid"></a>OpenId Connect

Það er auðkennislag ofan á OAuth2 samskiptareglurnar. Það gerir biðlurum kleift að sannreyna hver notandinn byggt á vottuninni
frá heimildarþjóninum, sem og að afla grunnupplýsinga um notendann á þægilegan máta.  
Sjá nánar [hér](https://openid.net/connect/)

### <a name="ids4"></a>IdentityServer 4

Það er OpenId Connect og OAuth 2.0 lausn sem er forrituð í ASP.NET Core.  
Auðkenningarþjónusta island.is er byggð ofan á þessa lausn.  
Sjá nánar [hér](https://identityserver4.readthedocs.io/en/latest/)

### <a name="token"></a>Tóki (token)

Þegar talað er um tóka tengt IdentityServer þá er verið að tala um tvo tókana sem að auðkennisþjónusta island.is skilar frá sér.  
Þeir eru

1. #### <a name="access-token"></a>Aðgangstókar (Access token)

   Aðgangstókar eru gefnir út til þess að leifa biðlurum að fá aðgang að þjónustum (API). Forrit fær aðgangstóka þegar notandi skráir sig inn og er veittur aðgangur,
   forritið sendir svo þennan aðgangstóka með HTTP köllum í API þjónustur til að fá aðgang að upplýsingunum sem leynast þar bakvið.

2. #### <a name="id-token"></a>Auðkennistókar (Identity token)

   Auðkennistókar geyma upplýsingar um notendann sem var að skrá sig inn og veitir forritum aðgang að þeim upplýsingum í gegnum þennan tóka.


### <a name="cors"></a>Cross-origin resource sharing (CORS)

CORS er aðferð sem gerir vefsíðum kleift að biðja um aðgang að takmörkuðum auðlindum frá öðru léni.  
Lesa má nánar um það með eftirfarandi hlekk
[hér](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

### <a name="grant-type"></a>Grant type

Í OAuth eru skilgreindar fjórar leiðir til að gefa út aðgangstóka.  
Þegar talað er um Grant type (eða leyfistegundir) að þá er verið að vísa í þessar fjórar leiðir

### <a name="auth-code"></a>Authorization Code Grant

Það er ein af leiðunum sem að er skilgreind í OAuth2 staðlinum til að gefa út aðgangstóka.  
Lesa má nánar um það [hér](https://tools.ietf.org/html/rfc6749#section-4.1)

### <a name="client-cred"></a>Client credentials

Önnur leið skilgreind í OAuth2 staðlinum til að gefa út aðgangstóka.  
Lesa má nánar um það [hér](https://tools.ietf.org/html/rfc6749#section-4.4)

### <a name="claims"></a>Claims

Claim er upplýsingabútur sem lýsir gefnu gildinu að einhverju leyti eða gefur því gildi.  
Dæmi um Claim eru nöfn, símanúmer og kennitölur einstaklinga. 

### <a name="security-level"></a>Öryggisstig

Öryggisstig lýsir því hversu vel hægt er að treysta auðkenningarleiðinni.  
Stigin eru fjögur í heildina með fyrsta stig hafandi minnsta öryggið og fjórða stigið með hæsta öryggið.  
Lesa má nánar um það [hér](https://it.wisc.edu/about/user-authentication-and-levels-of-assurance/)