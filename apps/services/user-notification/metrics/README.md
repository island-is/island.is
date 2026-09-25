# Tilkynningamælingar

Klukkustundarsafnarar senda samantektir til Datadog með núverandi DogStatsD-tengingu.
Þeir opna ekki HTTP-þjón, ræsa ekki SQS-vinnslu og senda ekki tilkynningar.
Mælaborðið er í [dashboard.json](./dashboard.json).

## Hvað er tilbúið?

| Heimild           | Keyrsla (UTC)          | Staða                                                                                           |
| ----------------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| user-profile      | `10 * * * *`           | Push-stillingar úr gagnagrunni                                                                  |
| user-notification | `15 * * * *`           | Fyrirtækjasendingar og sjö daga lestrarmæling                                                   |
| Firebase          | `20 * * * *`           | Safnari tilbúinn; óvirkur þar til staðfest aggregate-view og aðgangur liggja fyrir              |
| Pósthólf          | `20 * * * *`           | Safnari tilbúinn; óvirkur þar til full móttöku-/lestrargögn hafa verið tengd við aggregate-view |
| DLQ               | Fyrirspurn í mælaborði | Skipta þarf út fyrir staðfesta fyrirspurn í núverandi Datadog-logga                             |
| Opt-in            | Ekki virkjað           | Bíður nýju virkninnar og skilgreiningar gjaldgengra notenda                                     |

Jobbin eru skráð í dev, staging og prod, en undanskilin feature-deployments.
Hvert job notar `concurrencyPolicy: Forbid`, fær 10 mínútna svigrúm til að hefja
keyrslu og lokar gagnagrunnstengingu og DogStatsD-client þegar söfnun lýkur.
DB-safnarar nota eina tengingu, read-only session og 60 sekúndna statement timeout.
Tíðni er stillt í infra-skrám viðkomandi þjónustu.

## Skilgreiningar

Öll metric-heiti hér að neðan byrja á `islandis.notifications.analytics.`.
Þetta eru **gauges**. Sama dagstala er endursend á klukkustund; ekki nota
`sum`, `as_count()` eða summa klukkustundargildi til að reikna daglegar tölur.
Mælaborðið notar `max` yfir replica/host-merki og tímabil og slekkur á interpolation.
Við skoðun margra daga skal túlka þróun einstakra dagsgilda, ekki summu þeirra
yfir sjálfvirkt stækkuð rollup-tímabil.

### Push slökkt

- `push.disabled_users`: `document_notifications IS FALSE`.
- `push.known_users`: allir með non-null `document_notifications`.
- `push.unknown_users`: null-stillingar; undanskildar nefnara.
- Hlutfall = `100 * disabled_users / known_users`; engin gögn ef nefnari er 0.
- `recipient_type`: `individual`, `company` eða `other`.

Hópaskipting fylgir upprunalegu fyrirspurninni: tíu tölustafir og fyrstu tveir
á bilinu 41–71 teljast fyrirtæki; aðrar tíu stafa tölur teljast einstaklingar;
annað fer í `other`. Þetta er flokkun, ekki full sannprófun kennitölu.
Fjöldinn mælir skráðar stillingar, ekki virkt tæki eða heimildir stýrikerfis.
Gamla 5,9% talan merkti alla þrjá rofa slökkta og er **ekki** samanburðargrunnur.

### Fyrirtækjasendingar

`company.deliveries_previous_day` telur raðir í `notification_delivery` frá
00:00 gærdags til 00:00 dagsins í dag (efri mörk undanskilin), eftir `channel`.
Tenging við `user_notification.recipient` ákvarðar fyrirtækið, einnig fyrir
sendingu til umboðsmanns. Hvert push-tæki telst ein sending. `company.period_end`
gefur efri tímamörkin sem Unix-tíma í sekúndum.

Núverandi vinnslur skrifa delivery-röð eftir að veitandi samþykkir sendingu.
Þetta er ekki staðfest móttaka á tæki. Ef skráning í DB bregst eftir sendingu
vantar hana í mælinguna; fylgjast þarf með fyrirliggjandi `Error writing ... delivery record to db` loggum. Endursending sem raunverulega fer aftur til veitanda
telst önnur sending; endurkeyrsla safnarans eykur ekki töluna.

Batching er ekki útfært í þessu verkefni. Þegar það er bætt við verður að halda
**einni delivery-röð fyrir hverja raunverulega sendingu á viðtakanda/rás/tæki**,
ekki einni fyrir hvert skjal í batch. Núverandi primary key er auðkenni sendingar;
framtíðartenging við mörg skjöl má ekki margfalda þessar raðir í safnaranum.

### Ólesið eftir sjö daga

`unread_7d.total` og `unread_7d.unread` bera `kind:notification` eða `kind:document`.
Ólesið við mörkin þýðir `read_at IS NULL OR read_at > created + interval '7 days'`.
Lestur nákvæmlega á mörkunum telst innan sjö daga. Breyting aftur í ólesið
eyðir ekki fyrri lestri.

Móttökuhópur dagsins D er mældur frá 00:00 á D+8 þegar síðasta stak hópsins hefur
náð sjö daga aldri. Tilkynningasafnarinn sendir nýjasta heila hópinn; hann sendir
ekki afturvirka punkta. `unread_7d.cohort_end` gefur efri mörk hópsins.

Migration bætir nullable `read_at` við og setur DB-trigger sem varðveitir fyrsta
lestrartíma fyrir allar skrifleiðir, líka bulk-updates og eldri API-pods í rolling
deployment. Engar sögulegar dagsetningar eru tilbúnar út frá `updated`.
`notification_metrics_coverage.started_at` er sett þegar triggerinn er settur upp.
Aðeins heilir dagar eftir þann tíma eru taldir; fyrsti punktur fæst því eftir
rúma sjö til átta daga. `unread_7d.available=0` merkir að enginn heill hópur sé tilbúinn.

`actor_notification` hefur ekki sjálfstætt read-flagg. Þessi mæling nær því aðeins
yfir `user_notification`, ekki staðfestan lestur hvers umboðsmanns. Ekki lesa hana
sem mælingu á öllum umboðstilvikum. Pósthólfstengingin verður að fá fullan móttökuhóp
úr upprunaþjónustu; loggar um opnanir hjá þeim sem heimsækja pósthólfið nægja ekki.

## Firebase og pósthólf: tenging sem vantar

Engin gögn eða aðgangar voru tiltæk til að sannreyna upprunaschema.
Safnarinn hefur því skýran aggregate-view samning; ekki er gert ráð fyrir að
fyrirliggjandi loggar eða Firebase-export séu nú þegar í þessu sniði.
Staðfesta þarf vörumerkingu, mæliþekju og SQL gegn raunverulegri heimild áður en
viðkomandi job er virkjað. Raw-event mapping/export er enn verkefni við tengingu.

Setja þarf eftirfarandi á viðkomandi job í infra, með secrets úr venjulegri
secret-stýringu (aldrei lykla í git):

| Stilling                                                         | Merking                                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------ |
| `FIREBASE_METRICS_ENABLED=true` / `MAILBOX_METRICS_ENABLED=true` | Virkjar viðkomandi heimild                                   |
| `FIREBASE_METRICS_VIEW` / `MAILBOX_METRICS_VIEW`                 | `project.dataset.view`                                       |
| `METRICS_BIGQUERY_PROJECT`                                       | Verkefni sem keyrir og greiðir fyrir fyrirspurn              |
| `METRICS_BIGQUERY_LOCATION`                                      | Staðsetning gagnasafns, t.d. `EU`                            |
| `METRICS_GOOGLE_CREDENTIALS`                                     | Service-account JSON sem secret; má sleppa ef ADC er uppsett |

Nota reikning með BigQuery job-réttindum og lesaðgangi að samantektinni. Ekki
gera ráð fyrir að núverandi Firebase messaging-reikningur hafi þennan aðgang.
Fyrirspurnir takmarkast við 1 GB og 25 sekúndna synchronous bið. View skal
vera partition-pruned eða byggja á fyrirfram reiknuðum dagstölum. Ólokin fyrirspurn
eða röng gögn valda misheppnaðri söfnun, ekki sendingu núlltalna.

### Firebase-view

Ein röð á UTC-móttökudag og stýrikerfi:

| Reitur     | BigQuery-gerð | Samningur                                                                  |
| ---------- | ------------- | -------------------------------------------------------------------------- |
| `day`      | DATE          | UTC-dagur þegar skilaboð bárust tæki                                       |
| `platform` | STRING        | `android` eða `ios`                                                        |
| `received` | INT64         | Einstök pör skilaboða/tækja með staðfestri móttöku                         |
| `opened`   | INT64         | Einstök opnuð pör innan sama móttökuhóps, aldrei stærra en received        |
| `complete` | BOOL          | Bæði móttöku- og opnunargögn eru fullbúin fyrir samþykktan athugunarglugga |

Safnarinn sækir daginn fyrir þremur dögum til að gefa exporti svigrúm.
Skilgreina og staðfesta þarf athugunarglugga fyrir opnanir í uppruna-view áður en
það er virkjað og skrá hann í lýsingu mælaborðs. Ekki bera þessa nýju mælingu saman
við 18,2–23,4% frá ágúst án staðfestrar samsvörunar. Kerfi án móttökuatburða er
undanskilið; ekki skipta þeim út fyrir samþykktar sendingar til að fá nefnara.
Tómur hópur sem hefur fulla þekju fær sérstaka röð með 0/0, ekki tilbúið 0%.

### Pósthólfs-view

Ein röð á móttökudag: `day DATE`, `total INT64`, `unread INT64`, `complete BOOL`.
`total` er allur móttökuhópurinn og `unread` fylgir sömu sjö daga reglu og að ofan,
miðað við fyrsta lestur úr upprunaþjónustu. `complete` má aðeins vera true ef allur
hópurinn og lestrargögn gegnum sjö daga mörkin eru til staðar. Safnarinn sækir
móttökudaginn fyrir átta dögum. Ef gögnin eru sein birtist `external.available=0`.

Þessi útgáfa birtir eingöngu nýjasta skilgreinda hóp. Hún sækir ekki sjálfkrafa
aftur eldri hópa sem vantaði við fyrri keyrslur. Söguleg uppfylling krefst sér
útfærslu með varðveislu gagnatímabila; ekki endursenda gamla dagstala sem núverandi.

### Opt-in samningur

Þegar virkni kemur: `opt_in.users` og `opt_in.eligible_users` sem gauges með sama
`recipient_type` og profile-mælingin. Samþykkja þarf gjaldgengisskilgreiningu og
notendaval áður en kveikt er á mælingunni. Engin metric eða 0% er send á meðan.

## Keyrsla og próf

Venjulegt þróunarumhverfi verkefnisins og Node/Yarn-útgáfur úr `package.json` eiga við.
Eftir migration og build má keyra hvorn safnara sjálfstætt:

```sh
yarn nx run services-user-notification:migrate
yarn build services-user-notification
yarn build services-user-profile
node dist/apps/services/user-notification/main.cjs --job=metrics
node dist/apps/services/user-profile/main.cjs --job=metrics
node dist/apps/services/user-notification/main.cjs --job=external-metrics --source=firebase
node dist/apps/services/user-notification/main.cjs --job=external-metrics --source=mailbox
```

DB-stillingar fylgja `sequelize.config.js` hjá viðkomandi þjónustu. Datadog agent
þarf að vera aðgengilegur í `DD_AGENT_HOST` / `DD_DOGSTATSD_PORT`; `DD_ENV` merkir
umhverfið. Nota má sérstakan read-only DB-notanda með SELECT á viðkomandi töflum
og coverage-töflunni. Sjálfgefnar infra-stillingar endurnýta DB-secret þjónustunnar,
en safnari biður PostgreSQL um read-only session.

```sh
yarn jest --config apps/services/user-notification/metrics/jest.config.js --runInBand
```

Pure tests þurfa ekki Docker. PostgreSQL-próf eru keyrð þegar
`METRICS_TEST_DATABASE_URL` vísar á **einangraðan prófunargagnagrunn**. Þau búa til
einstakt schema, sannreyna migrations/trigger/SQL/tímamörk og fjarlægja það á eftir.
Án breytunnar eru þau merkt skipped; það jafngildir ekki staðfestum DB-prófum.

## Innleiðing og mælaborð

1. Keyra DB-próf og prófa migrations í staging. Index-migration notar
   `CREATE INDEX CONCURRENTLY` utan transaction; yfirfara invalid index ef build
   var rofið áður en það er reynt aftur.
2. Innleiða migrations áður en ný API/collector-image keyrir. Read-trigger og
   coverage-staða verða virk saman. Við rollback þarf að bakka kóða með `readAt`
   áður en dálkurinn er fjarlægður.
   Ný service accounts þurfa viðeigandi IAM-roles/trust og aðgang að tilgreindum
   secrets áður en jobbin eru virkjuð í klasa: `service-portal-metrics`,
   `user-notification-metrics`, `user-notification-firebase-metrics` og
   `user-notification-mailbox-metrics`. Helm-gildin vísa í þessi role-heiti;
   uppsetning þeirra í AWS er utan þessa repository.
3. Skoða `EXPLAIN (ANALYZE, BUFFERS)` á staging fyrir dagfyrirspurnir og profile
   aggregate. Bera tölur saman við óháðar SQL-fyrirspurnir og staðfesta álag.
4. Staðfesta DogStatsD-tengingu og `env`-merki í dev/staging, síðan production.
   `collection.success`, `collection.last_success` og `collection.duration_ms`
   mælast eftir `source`. UDP-send staðfestir ekki að Datadog hafi tekið við gögnunum;
   staðfesta þarf komu þeirra í Metrics Explorer.
5. Flytja `dashboard.json` inn í Datadog með dashboard JSON editor/import.
   Skipta `__CONFIGURE_DLQ_TRANSITION_FILTER__` út fyrir raunverulega fyrirspurn
   á DLQ-transition atvik, halda `service:user-notification` og `$env`. Ef loggar
   tvítelja atvik þarf unique-count á stöðugu atviksauðkenni í stað `count`.
6. Staðfesta DLQ-töluna gegn þekktu atviki og sendingatölur gegn DB. Kveikja aðeins
   á Firebase/pósthólfi eftir að view-samningur og heimild eru sannreynd.
7. Fylgjast með ferskleika: safnari ætti að uppfæra á klukkustund. Setja no-data
   monitor fyrir virkar heimildir með 90 mínútna mörkum og fylgjast sérstaklega
   með `external.available` og `external.period_start`; successful keyrsla getur
   staðfest að upstream-gögn séu enn ekki tiltæk.

Stöðumælingar, Firebase-gögn og lestrartímar eru ekki fyllt aftur í tímann í þessari
útgáfu. Raunveruleg Datadog-birting og ytri gagnatengingar þurfa aðgang sem fylgir
ekki þessum kóðabreytingum.

Heimildir: [BigQuery jobs.query](https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query),
[Firebase BigQuery export](https://firebase.google.com/docs/projects/bigquery-export).
