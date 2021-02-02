# Client

Skrá þarf biðlara (e. Client) fyrir þjónustu en biðlari er forrit sem biður um auðkenni frá innskráningarkerfinu.
Til þess að forrit geti haft aðgang að gögnum verndað af innskráningarkerfinu þarf að vera til biðlari sem hefur aðgang
að þeim gögnum.

## Create new client - Simple form

![simple-form](images/simple-form.png)

- ### Client Type

  Sjá nánar um týpur biðlara [hér](types.md)

- ### National Id / Kennitala

  Skráð kennitala eiganda biðlarans

- ### Client Id

  Auðkenni biðlarans sem er verið að búa til

- ### Base uri

  Grunnvefslóð þessa biðlara.  
  Notað til að bæta við [Cors origin](edit/README.md#allowed-cors-origin),
  [RedirectURI](edit/README.md#redirect-uri) og
  [Post Logout URI](edit/README.md#post-logout-uris).  
   Út frá þessu gildi eer fyrsta Redirect Uri biðlarans búið til.

## Detailed form

Ítarlegt skráningarform býður notendum þjónustusíðnanna upp á fleiri möguleika við skráningu nýs biðlara.  
Lesa má nánar um það [hér](detailed-form.md)
