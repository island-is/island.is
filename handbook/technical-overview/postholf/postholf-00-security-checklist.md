# Gátlisti

Í þessum gátlista má finna atriði sem vefþjónusta skjalaveitna (SkjalaveitaAPI) þarf að uppfylla áður en tenging við Pósthólf Ísland.is getur átt sér stað. Tilgangurinn með gátlistanum er að koma í veg fyrir mögulegar öryggisholur þegar vefþjónustur eru útfærðar af skjalaveitum.

## Flutningslag

Öll samskipti eiga að vera dulkóðuð, notast þar við https (TLS 1.2+). Skilríki á vefþjón ættu að vera útgefin af vottuðum skilríkjaútgefanda (ekki self signed).

- [ ] Samskipti eru dulkóðuð á þjóni sem styður TLS 1.2+.
- [ ] Skilríki á þjóni eru útgefin af vottuðum skilríkjaútgefanda.

## Auðkenning

Vefþjónusta ætti að vera útfærð með OAuth2 auðkenningu, þar sem aðgangstóki (e. Access token) er sannreyndur út frá undirritunarskilríki auðkenningarþjóns. Einnig skal þjónustan sannreyna gildissvið (e. Scope) og gildistíma aðgangstókans. Þjónustan ætti ekki að vera aðgengileg með öðrum hætti.

- [ ] Vefþjónustan er einungis aðgengileg með OAuth2.
- [ ] Vefþjónustan sannreynir að aðgangstóki sé undirritaður af auðkenningarþjóni.
- [ ] Aðgangur er aðeins heimill sé rétt gildissvið (e. Scope) í aðgangstóka.
- [ ] Aðgangstóka er hafnað sé reynt að nota hann utan gildistíma hans.

## Skilríkjatraust

Í raunumhverfi skjalaveitu ætti einungis að treysta aðgangstókum sem gefnir eru út af auðkenningarþjóni raunumhverfis Ísland.is. Prófunarumhverfi Pósthólfsins notast við annan auðkenningarþjón sem ætti aldrei að vera treyst í raunumhverfi.

- [ ] Raunumhverfi treystir einungis auðkenningarþjóni raunumhverfis Ísland.is

## Aðgangstakmarkanir

Vefþjónustan ætti að vera lokuð á netlagi. Þ.e. hún ætti einungis að vera aðgengileg þeim IP tölum sem Pósthólfið á ísland.is notar þegar kallað er í þjónustuna.

- [ ] Vefþjónustan er einungis aðgengileg IP tölum sem Pósthólfið á Ísland.is notar.

## Sannreyna Inntaksform

Inntak ætti að sannreyna með tilliti til innspýtingar (e. Injection) ásamt því að tryggja rétt snið (e. format).

- [ ] Vefþjónustan skilar villu ef inntak er tómt (þ.e. annað hvort kennitala eða skjalId er tómt).
- [ ] Vefþjónustan skilar villu ef kennitala er ekki á réttu sniði.
- [ ] Vefþjónustan skilar villu ef einkenni skjals (skjalId) er ekki á réttu sniði. Snið er ákveðið af skjalaveitu.
- [ ] Vefþjónustan er varin fyrir innspýtingu (e. Injection). https://www.owasp.org/index.php/Top_10-2017_A1-Injection

## Sannreyna Inntaksgögn

Þegar Pósthólfið á Ísland.is sækir skjöl frá skjalaveitum er sent par af kennitölu og einkenni skjal (SkjalId). Skjalaveitan ætti alltaf að sannreyna að skjalið sem vísað er í (skjalId) sé í eigu gefinnar kennitölu. M.ö.o. er skjalinu ekki skilað eingöngu útfrá gefnu einkenni skjals (skjalId).

- [ ] Vefþjónustan ber saman kennitölu og einkenni skjals áður en skjali er skilað.

## Atburðarskráning

Þegar kallað er í þjónustuna ætti skrá öll köll í atburðarskráningu. Þar ætti að koma fram kennitala og einkenni skjals sem var sótt (eða reynt að sækja).

- [ ] Aðgerðir eru skráðar í atburðarskráningu.
