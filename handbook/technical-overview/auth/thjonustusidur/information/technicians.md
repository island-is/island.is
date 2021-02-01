# Technicians

## Upplýsingar um innskráningarkerfi Stafræns Íslands

Innskráningarþjónusta Stafræns Íslands er auðkenningarkerfi sem tengir notendur kerfisins við þjónustu Stafræns Íslands.  
Innskráningarkerfið leitast við að bjóða upp á val um innskráningarleiðir eftir þörfum notenda og viðskiptavina þess.

## Forritun á móti innskráningarkerfinu

Nákvæmar leiðbeiningar um hvernig hægt er að forrita á móti innskráningarkerfinu er að finna í kerfishandbókunum með því að smella [hér](https://github.com/island-is/island.is/tree/main/handbook/technical-overview/auth/system)

## Kóðadæmi

Nokkur dæmi um útfærslur á tengingum við innskráningarþjónustu í mismunandi forritunarumhverfum er að finna með því að smella [hér](https://github.com/island-is/identity-server.samples)

## Virkni og rekstur innskráningarkerfisins

Innskráningarkerfið skiptist í þrjá meginhluta

1.  ### Bakendi

    Gagnagrunnur. Gögn um notendur sem nota innskráningarkerfið, gögn um biðlarana sem notendurnir nota, gögn um API-forritaskil sem skapa gögn, gögn um heimildarveitingar.

2.  ### Auðkennisveita

    Auðkenningin sjálf. Auðkenningin getur farið fram í
    [síma](../instructions/client/edit/README.md#sim-card) og á
    [korti](../instructions/client/edit/README.md#identity-card).

3.  ### Framendi

    Viðmótið sem notandinn hefur samskipti í gegnum.

Hlutverk rekstraraðila er að viðhalda þessum þremur hlutum kerfisins og sjá til þess að þeir virki rétt.

Við þróun auðkenningarinnar notast rekstraraðili við kerfið
[Identity server](#ids4) sem er stöðluð hugbúnaðarlausn sem sér um auðkenninguna og vinnur samhliða lausnum rekstraraðila.

Nánari upplýsingar um innskráningarkerfið má finna í kerfishandbókunum á eftirfarandi hlekk:

## <a name="ids4"></a>Upplýsingar um Identity Server

Við þróun auðkenningarinnar notast rekstraraðili við kerfið [Identity server](https://identityserver.io/) sem er stöðluð hugbúnaðarlausn sem sér um auðkenninguna og vinnur samhliða lausnum rekstraraðila.

[Identity server](https://identityserver.io/) skiptist í þrjá meginhluta:

1.  ### Notendur (e. users)

    Mannlegur notandi sem notar skráðan [biðlara](../instructions/client/README.md)
    til að nálgast [tilföngin](../instructions/resources/README.md).

2.  ### Biðlarar (e. clients)

    Hugbúnaður sem biður um auðkenni frá [Identity server](https://identityserver.io/), ýmist til þess að auðkenna notanda eða nálgast tilföng.  
    Skrá þarf biðlara hjá [Identity server](https://identityserver.io/) áður en hægt er að óska eftir auðkennum.  
    Biðlarar geta til dæmis verið vefir, öpp fyrir síma og hugbúnaður fyrir borðtölvur.

3.  ### Tilföng (e. resources)

    Tilföng eru það sem [Identity server](https://identityserver.io/) þarf að vernda, þ.e. ýmist auðkennisgögn [notenda](../instructions/users/) eða
    forritaskil (_API_).  
    Tilföng skiptast í þrennt:

    1.  #### Forritaskilatilföng (e. API Resources)

        Forritaskil eru viðmót sem [biðlarar](../instructions/client/README.md) kalla á.  
        Þau hýsa auðkennisgögnin og svarar beiðnum biðlara um auðkennisgögn í gegnum [aðgangstóka (e. _access token_)](../instructions/concepts.md#access-token).

    2.  #### Forritaskilaumfang (e. API Scopes)

        Umfang eru virkni í OAuth 2.0 sem takmarkar aðgang [biðlara](../instructions/client/README.md) að reikningum [notenda](../instructions/users/README.md).
        Biðlari getur sótt um eitt eða fleiri umföng.  
        Þessar upplýsingar eru síðan birtar notanda í staðfestingarglugga (e. _consent screen_) en [auðkennistókinn](../instructions/concepts.md#access-token) sem viðkomandi biðlari hefur hlotið er takmarkaður við umfang biðlarans.

    3.  #### Auðkennistilföng (e. Identity Resources)

        Auðkennisgögn sem auðkenna notendur, t.d. nöfn og netföng.  
        Auðkennistilföng hafa eigið nafn og hægt er að ánafna þeim [staðhæfingartegundir (_claim type_)](../instructions/concepts.md#claims) að eigin vali.  
        Þessar staðhæfingar eru síðan innifaldar í [auðkennistóka (e._identity token_)](../instructions/concepts.md#identity-token) notenda.  
        Biðlari notast við stika umfangsins (e. _scope parameter_) til að
        sækja um aðgang að auðkennistilföngunum.

## Frekari upplýsingar

Hægt er að lesa um fleiri hugtök tengt auðkenningarþjónustu island.is [hér](../instructions/concepts.md)
