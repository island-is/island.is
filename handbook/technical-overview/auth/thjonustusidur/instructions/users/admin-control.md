# Admin control

Umsjónarmenn þjónustusíðna eru þeir sem hafa aðgang að þjónustusíðunum.
Í þessum flipa er hægt að hafa stýra fjórum þáttum kerfisins  
[Admin Users](#admin-users)  
[Identity Providers](#identity-providers)  
[IP Addresses](#ip-adresses)  
[Logs](#logs)  

![admin-control.png](images/admin-control.png)

## <a name="admin-users"></a>Admin users / Umsjónarmenn þjónustsíðna

Í þessum flipa er hægt að sjá lista yfir skráða umsjónarmenn þjónustusíðnanna og skrá nýja umsjónarmenn með því að smella á
hnappinn _+ Create new Admin UI User_.

![create-new-admin](images/create-new-admin.png)

### <a name="create"></a>+ Create new Admin UI User

![new-admin-user-details](images/new-admin-user-details.png)

Fylla þarf út reitina _National Id (Kennitala)_ og User Email_ en
reiturinn _Scope_ er með sjálfgefið gildi sem ekki er hægt að
skipta um.

- #### <a name="national-id"></a>National Id / Kennitala

  Skráð kennitala umsjónarmanns (e. admin user)

- #### <a name="email"></a>User email

  Netfang umsjónarmanns

- #### <a name="scope"></a>Scope

  Umfang (e. scope) aðgangs umsjónarmannsins, m.ö.o. hversu mikinn aðgang
  tiltekinn umsjónarmaður hefur.
  Sjálfgefið gildi í þessum reit er _Full control_ og er hvorki hægt að
  eyða því né velja annað gildi.

- #### Cancel

  Ef smellt er á þennan hnapp er hætt við skráningu umsjónarmanns og
  farið aftur í flipann [Umsjónarmenn / Admin
  users](#admin-users).

- #### Save
  Ef smellt er á þennan hnapp er skráður umsjónarmaður vistaður og farið
  aftur í flipann [Umsjónarmenn / Admin users](#admin-users).

## <a name="identity-providers"></a>Identity providers / Auðkennisveitur

Í þessum flipa er hægt að sjá lista yfir skráðar auðkennisveitur og skrá nýjar auðkennisveitur með því að smella á hnappinn _+ Create new Identity Provider_.

![idp-frontpage](images/idp-frontpage.png)

### <a name="new-idp-provider"></a>+ Create new Identity Provider

![new-idp-provider](images/new-idp-provider.png)

Fylla þarf út alla reitina: _Name_, _Label_, _HelpText_ og _Level_.

- #### <a name="name"></a>Name

  Nafn auðkennisveitunnar.  
  Nafnið má hvorki innihalda stafabil né tákn

- #### <a name="label"></a>Label

  Stutt lýsing á þessari auðkennisveitu.  
  Lýsingin mun birtast í [Idp restrictions](../client/edit/README.md#idp-restrictions).

- #### <a name="help-text"></a>Help text

  Textinn sem hér er skráður inn mun birtast sem hjálpartexti fyrir þessa auðkennisveitu í [Idp restrictions](../client/edit/README.md#idp-restrictions).

- #### <a name="level"></a>Level

  [Öryggisstig](../concepts.md#security-level) þessarar auðkennisveitu.  
  Skrá verður gildi frá 1 og upp í 4.
  4 er hæsta öryggisstigið og 1 það lægsta.

## <a name="ip-addresses"></a>Ip Adresses

Þessi flipi er enn í vinnslu

## <a name="logs"></a>Logs

Í þessum flipa er hægt að fá aðgang að loggum úr innskráningarkerfinu
frá loggunarkerfinu [Datadog](https://app.datadoghq.eu/logs?cols=core_host%2Ccore_service&from_ts=1603725071881&index=&live=true&messageDisplay=expanded-md&query=kube_namespace%3Aidentity-server%20service%3Aauth-admin-web&stream_sort=desc&to_ts=1603725971881)

