# Client Detailed Form

Hér verður lýst flókna ferlinu við að búa til biðlara og lýst vel hvað gildin gera.

![detailed-form.png](images/detailed-form.png)

- ### <a name="client-type"></a>Client Type

  Sjá nánar um týpur biðlara [hér](types.md)

- ### National Id / Kennitala

  Skráð kennitala eiganda biðlarans

- ### <a name="client-id"></a>Client Id

  Auðkenni biðlarans sem er verið að búa til

- ### <a name="display-name"></a>Display Name

  Nafn biðlarans sem birtist í staðfestingarglugga (e. _consent screen_).

- ### <a name="display-url"></a>Display URL

  Vefslóð (URI) biðlara sem sýnir nánari upplýsingar um hann og birtist í samþykkisglugganum.

- ### <a name="description"></a>Description

  Lýsing á biðlara til að nota innan IDS-stýringar.

- ### <a name="require-consent"></a>Require Consent

  Ef hakað er við þennan reit er gert ráð fyrir samþykkisskjá (consent screen).

- ### <a name="enabled"></a>Enabled

  Ef hakað er við þennan reit er biðlarinn heimilaður.  
  Sjálfgefið er að hakað sé við reitinn.

- ### <a name="advanced"></a>Advanced

  Ef smellt er á örina ![arrow](images/arrow.png) við hlið þessa texta opnast fleiri valmöguleikar:

![detailed-form-advanced1.png](images/detailed-form-advanced1.png)

- ### <a name="front-channel-uri"></a>Front Channel Logout URI

  Velur útskrániningar-URI biðlara fyrir HTTP-byggða front-channel
  útskráningu.  
   [Sjá OIDC Connect Session Managment spec fyrir nánari umfjöllun](https://openid.net/specs/openid-connect-session-1_0.html).

- ### <a name="rair-wise-subject-salt"></a>Rair Wise Subject Salt

  _Salt_-gildi sem er notað fyrir gerð tvíþætts [_subjectId_](../concepts.md#id-token) notenda viðkomandi biðlara.

- ### <a name="user-code-type"></a>User Code Type

  Tilgreinir hvers konar notendakóða á að nota fyrir viðkomandi biðlara.  
   Ef ekkert gildi er skráð er farið aftur í sjálfgefna stillingu.

- ### <a name="access-token-type"></a>Access Token Type

  Hér er tilgreint hvort [aðgangstókinn](../concepts.md#access-token) sé tilvísunartóki eða sjálfheldinn (self-contained) JWT-tóki (JWT er sjálfgefið val).

- ### <a name="access-token-lifetime"></a>Access Token LifeTime

  Gildistími [aðgangstóka](../concepts.md#access-token) í sekúndum talið (sjálfgefið val er 3600 sekúndur / 1 klst).

- ### <a name="auth-code-lifetime"></a>Authorization Code Lifetime

  Gildistími [heimilunarkóða (_authorizationcode_)](../concepts.md#auth-code) í sekúndum talið
  (sjálfgefnar stillingar eru 300 sekúndur / 5 mínútur).

- ### <a name="consent-lifetime"></a>Consent Lifetime

  Gildistími notendastaðfestingar í sekúndum talið.  
   Sjálfgefið val er 0 (óendanlegur gildistími).

- ### <a name="device-code-lifetime"></a>Device Code Lifetime

  Gildistími tækiskóða (_device code_) í sekúndum talið (sjálfgefið val er 300 sekúndur / 5 mínútur).

![detailed-form-advanced2](images/detailed-form-advanced2.png)

- ### <a name="user-sso-lifetime"></a>User Sso Lifetime

  Hámarks gildistími frá því að notandi auðkenndi sig síðast í sekúndum
  talið.  
   Sjálfgefið val er 0.

- ### <a name="refresh-token-usage"></a>Refresh Token Usage

  Ef gildið _ReUse_ er valið mun haldfang endurnýjaðs tóka (_refresh token handle_) vera það sama þegar tóki er endurnýjaður.  
   Ef gildið _OneTime_ er valið mun haldfang endurnýjaða tókans uppfærast þegar tóki er endurnýjaður.  
   _OneTime_ er sjálfgefið val.

- ### <a name="refresh-token-expiration"></a>Refresh Token Expiration

  Ef valið er gildið _Absolute_ mun endurnýjaði tókinn renna út á ákveðnum tímapunkti (tilgreindur í [Absolute Refresh Token Lifetime](#absolute-refresh-token-lifetime)).  
   Ef gildið _Sliding_ er valið mun gildistími endurnýjaða tókans endurnýjast (að því marki sem stillt er í [Sliding Refresh Token Lifetime](#sliding-refresh-token-lifetime)). Gildistíminn getur þó ekki verið lengri en [Absolute Refresh Token Lifetime](#absolute-refresh-token-lifetime).

- ### <a name="sliding-refresh-token-lifetime"></a>Sliding Refresh Token Lifetime

  Gildistími endurnýjaða tókans ef _Sliding_ var valið í [Refresh Token Expiration](#refresh-token-expiration).  
   Sjálfgefið gildi er 1296000 sekúndur / 15 dagar.

- ### <a name="absolute-refresh-token-lifetime"></a>Absolute Refresh Token Lifetime

  Hámarks gildistími endurnýjaða tókans í sekúndum talið.  
   Sjálfgefið gildi er 2592000 sekúndur / 30 dagar.

- ### <a name="id-token-lifetime"></a>Identity Token Lifetime

  Gildistími [auðkennistóka](../concepts.md#id-token) í sekúndum talið (sjálfgefið gildi er 300 sekúndur / 5 mínútur)

- ### <a name="protocol"></a>Protocol type

  Dæmigert gildi er _oidc_

- ### <a name="prefix"></a>Client Claims Prefix

  Ef gildi er skráð í þennan reit mun biðlarastaðhæfing af
  viðkomandi gerð fá skráð gildi sem forskeyti (_prefix_).  
   Sjálfgefið gildi er _client _ \_.  
   Tilgangurinn með þessu er að koma í veg fyrir að biðlarastaðhæfingar rekist saman við notendastaðhæfingar.

![detailed-form-advanced3.png](images/detailed-form-advanced3.png)

- ### <a name="access-token-browser"></a>Allow Access Token Via Browser

  Hakreitur sem segir til um hvort viðkomandi biðlari megi taka við
  [aðgangstókum](../concepts.md#access-token) frá vöfrum.  
   Þetta getur nýst við að skerpa á flæði sem heimila fjölþátta svörunargerðir (_response types_).  
   Það er gert með því að heimila ekki biðlara með blandað flæði (_hybrid flow_) sem á að nota _code id_token_ til að bæta við svörunargerðina og þannig leka [tókanum](../concepts.md#token) yfir í vafrann.

- ### <a name="offline-access"></a>Allow Offline Access

  Hakreitur sem segir til um hvort þessi biðlari megi biðja um að endurnýjaða
  [tóka](../concepts.md#token) (með því að sækja um _offline_access_ umfangið).  
  Svo að biðlarar geti notað _refresh token_ að þá verður þetta gildi að vera á.

- ### <a name="plain-text-pkce"></a>Allow Plain Text Pkce

  Hakreitur sem segir til um hvort [iðlarar sem nota PKCE geti notað _plain text code challenge_ (ekki mælt með þessu).

- ### <a name="allow-consent"></a>Allow Remember Consent

  Hakreitur sem segir til um hvort notandi geti valið að geyma staðfestingar (_consent decisions_).

- ### <a name="user-claims-id-token"></a>Always Include User Claims In Id Token

  Ef hakað er við þennan reit eiga [auðkennistókar](../concepts.md#id-token) alltaf að innihalda
  notendastaðhæfingar (_user claims_ þegar sótt er bæði um [auðkennistóka](../concepts.md#id-token) og
  [aðgangstóka](../concepts.md#access-token).  
   Ef ekki er hakað við reitinn eiga biðlarar að nota endapunkt fyrir
  notendaupplýsingar (_userinfo endpoint_).  
   Sjálfgefið gildi er _false_.

- ### <a name="send-client-claims"></a>Always Send Client Claims

  Ef hakað er við þennan reit verður biðlarastaðhæfing (_client claim_) send fyrir hvert flæði (_flow_).  
   Ef ekki er hakað við þennan reit verða biðlarastaðhæfingar einungis sendar fyrir flæði biðlaraskírteina (_client credential flow_).  
   Sjálfgefið gildi er _false_.

- ### <a name="back-channel"></a>Back Channel Logout Session Required

  Ef hakað er við þennan reit verður _session id_ notanda sent með staðhæfingunni til _BackChannelLogoutUri_.

- ### <a name="local-login"></a>Enable Local Login

  Ef hakað er við þennan reit getur viðkomandi biðlari einungis notað staðbundna reikninga eða
  ytri (_external_) IdP.

- ### <a name="front-channel-required"></a>Front Channel Logout Session Required

  Ef hakað er við þennan reit má senda _session id_ notanda á _FrontChannelLogoutUri_.

- ### <a name="jwt-id"></a>Include Jwt Id

  Ef hakað er við þennan reit munu _JWT aðgangstókar_ vera með einstakt auðkenni
  (_unique ID_) innbyggt (í gegnum _jwt-claim_).

- ### <a name="client-secret"></a>Require Client Secret

  Ef hakað er við þennan reit þarf viðkomandi biðlari að vera með huldustreng (_secret_) til að geta sótt um
  [tóka](../concepts.md#token) frá endapunkti tókans (_token endpoint_).

- ### <a name="pkce"></a>Require Pkce

  Ef hakað er við þennan reit verða biðlarar sem notast við
  [leyfistegund (_grant type_)](../concepts.md#grant-type) byggða á
  [heimilunarkóða (_authorization code_)](../concepts.md#access-token) að senda frá sér
  prófunarlykil (_proof key_).

- ### <a name="update-access-tokens-refresh"></a>Update Access Token Claims On Refresh

  Ef hakað er við þennan reit er ákvarðað gildi sem segir til um hvort
  [aðgangstókinn](../concepts.md#access-token) og [gildi hans (_claims_)](../concepts.md#claims)
  verði uppfærðar þegar staðhæfing kemur um endurnýjun tókans.

- ### Cancel

  Ef smellt er á þennan hnapp er skráningu biðlarans hætt

- ### Next
  Ef smellt er á þennan hnapp er farið yfir í [annað þrep skráningar biðlarans: Redirect Uri](edit/README.md#redirect-uri)
