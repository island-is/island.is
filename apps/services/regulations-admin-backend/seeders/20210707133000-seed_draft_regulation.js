/* eslint-disable local-rules/disallow-kennitalas */
'use strict'

const TEST_USERS = {
  utlond: '0101307789',
  afrika: '0101303019',
  amerika: '0101302989',
}

const draftRegulationSeed = [
  {
    id: 'a1fd62db-18a6-4741-88eb-a7b7a7e05833',
    drafting_status: 'draft',
    title:
      'Reglugerð um styrki vegna sýninga á kvikmyndum á íslensku í kvikmyndahúsum hér á landi.',
    text: '<h3 class="article__title">1. gr. <em class="article__name">Almennt.</em></h3>\n<p>Test: Þessi reglugerð breytir reglugerð nr. 1146/2010</p>\n<p>Test: Þessi reglugerð breytir reglugerð nr. 1165/2015</p>\n<p>\n\tReglugerð þessi kveður á um styrki vegna sýninga á kvikmyndum á íslensku í\n\tkvikmyndahúsum hér á landi á grundvelli laga nr. 137/2001.\n</p>\n<p>\n\tStyrkir sem veittir eru á grundvelli reglugerðar þessarar falla undir\n\treglugerð framkvæmdastjórnar (ESB) nr. 1407/2013 um beitingu 107. og 108. gr.\n\tsáttmálans um starfshætti Evrópusambandsins gagnvart minniháttar aðstoð, sbr.\n\tákvörðun sameiginlegrar EES-nefndar nr. 98/2014 frá 16. maí 2014, sbr. b-lið\n\t1. gr. reglugerðar nr. 1165/2015 um gildistöku reglugerða\n\tframkvæmda­stjórnar­innar um ríkisaðstoð.\n</p>\n<h3 class="article__title">\n\t2. gr. <em class="article__name">Gildissvið og viðfangsefni.</em>\n</h3>\n<p>\n\tHeimilt er að greiða sérstaka styrki, sýningarstyrki, úr ríkissjóði vegna\n\tsýninga kvikmynda á íslensku, sem eru að lágmarki 70 mínútur í sýningu, í\n\tkvikmyndahúsum hér á landi.\n</p>\n<p>\n\tMeð kvikmynd á íslensku er átt við að frumútgáfa kvikmyndar, sem sýnd hefur\n\tverið í kvik­mynda­húsi hér á landi, sé með íslensku tali. Þar er vísað til\n\tþess að meira en helmingur talmáls sé á íslensku. Kvikmyndir sem eru talsettar\n\teða textaðar á íslensku fyrir sýningar í íslenskum kvikmynda­húsum teljast því\n\tekki vera á íslensku í samhengi þessarar reglugerðar.\n</p>\n<p>\n\tSýningarstyrkir eru ekki greiddir vegna sjónvarpsþátta sem teknir eru til\n\tsýninga í kvik­mynda­húsum.\n</p>\n<h3 class="article__title">\n\t3. gr. <em class="article__name">Hverjir geta sótt um sýningarstyrk.</em>\n</h3>\n<p>\n\tUmsókn um sýningarstyrk vegna kvikmyndar skal vera í nafni\n\tframleiðslufyrirtækis sem bar ábyrgð á gerð og fjármögnun hennar. Sé um\n\tsamframleiðsluverkefni að ræða skal umsókn lögð fram í nafni aðalframleiðanda,\n\teða aðila sem hann veitir til þess umboð.\n</p>\n<p>\n\tFramleiðslufyrirtækið skal hafa staðfestu á Íslandi eða í öðru ríki á Evrópska\n\tefnahagssvæðinu.\n</p>\n<h3 class="article__title">\n\t4. gr. <em class="article__name">Fjárhæð sýningarstyrks.</em>\n</h3>\n<p>\n\tRáðherra ákveður hvaða fjárhæð skuli varið til sýningarstyrkja af\n\tfjárveitingum í Kvikmyndasjóð.\n</p>\n<p>\n\tSýningarstyrkir eru reiknaðir út á ársgrundvelli. Við veitingu sýningarstyrkja\n\tskal miða við almennar sýningar á næstliðnu almanaksári.\n</p>\n<p>\n\tSýningarstyrkir skulu nema allt að 20% af heildarsölutekjum kvikmynda í\n\talmennum sýningum á íslensku í innlendum kvikmyndahúsum á því ári eftir því\n\tsem fjárveitingar leyfa skv. 1. mgr.\n</p>\n<p>\n\tHámarksfjárhæð sýningarstyrks skal taka mið af því að heildarríkisstyrkir til\n\thverrar kvikmyndar nemi ekki hærri fjárhæð en 85% af framleiðslukostnaði sem\n\tvísað er til í 6. gr., sbr. 7. gr. laga nr. 43/1999 um tímabundnar\n\tendurgreiðslur vegna kvikmyndagerðar á Íslandi.\n</p>\n<p>\n\tHámarksfjárhæð sýningarstyrks skal taka mið af reglum um minniháttar aðstoð,\n\tsbr. 1. gr. Sýningarstyrkur til framleiðslufyrirtækis hverrar kvikmyndar skal\n\tfalla innan þeirra marka að framleiðslufyrirtæki kvikmyndarinnar hafi ekki\n\tnotið minniháttar styrkja umfram 200 þúsund evrur á næstliðnum tveimur árum og\n\tyfirstandandi reikningsári. Við umreikning yfir í íslenskar krónur skal miða\n\tvið gengi sem ESA gefur út og birt er í EES-viðbæti við Stjórnartíðindi\n\tEvrópusambandsins og á vef stofnunarinnar.\n</p>\n<h3 class="article__title">\n\t5. gr. <em class="article__name">Efniskröfur til umsókna og umsóknargögn.</em>\n</h3>\n<p>\n\tUmsækjandi skal staðfesta að hann sé framleiðandi kvikmyndar, að hann hafi\n\tborið ábyrgð á gerð hennar og fjármögnun. Hann skal staðfesta að hann hafi\n\tstaðfestu á Íslandi eða Evrópska efna­hags­svæðinu, að umsókn sé vegna sýninga\n\tá kvikmynd á íslensku og að frumgerð kvik­myndar­innar sé með íslensku tali.\n</p>\n<p>\n\tÞá skal umsókn um sýningarstyrki að lágmarki innihalda eftirtaldar\n\tupplýsingar:\n</p>\n<ol type="a">\n\t<li>\n\t\tYfirlit yfir tekjur af sölu aðgöngumiða kvikmyndar á almennum sýningum hjá\n\t\tinnlendum kvikmyndahúsum.\n\t</li>\n\t<li>\n\t\tKostnaðaruppgjör kvikmyndar, staðfest af endurskoðanda eða stjórn\n\t\tframleiðslufélags sem staðfestir heildarframleiðslukostnað kvikmyndar.\n\t</li>\n\t<li>\n\t\tUpplýsingar um styrki sem aflað var vegna framleiðslu kvikmyndarinnar frá\n\t\topinberum aðilum, auk yfirlýsingar framleiðanda um hvort fjárhæð styrkja sem\n\t\tfalla undir reglur um minniháttar styrki á síðustu þremur árum nemi hærri\n\t\tfjárhæð en jafnvirði 200 þúsund evra.\n\t</li>\n</ol>\n<p>\n\tUmsækjandi ber ábyrgð á réttmæti umsóknargagna, þau séu áreiðanleg og\n\tstaðfesti án vafa fjár­hæð tekna af sýningum í innlendum kvikmyndahúsum,\n\theildarframleiðslukostnað við gerð kvik­myndar­innar og styrki sem opinberir\n\taðilar hafa veitt við gerð kvikmyndarinnar.\n</p>\n<h3 class="article__title">\n\t6. gr. <em class="article__name">Meðferð og umsýsla umsókna.</em>\n</h3>\n<p>\n\tKvikmyndamiðstöð Íslands auglýsir eftir og tekur á móti umsóknum, leggur mat á\n\tumsóknir og greiðslu styrkja, auk þess að gefa út leiðbeiningar og skilgreina\n\tnánar kröfur sem gerðar eru til umsóknargagna.\n</p>\n<p>\n\tKvikmyndamiðstöð Íslands er heimilt að óska viðbótargagna úr bókhaldi\n\tframleiðslufélags til stað­festingar á sölutekjum og öðrum rekstrarstærðum sem\n\tgefnar eru upp í umsóknargögnum. Við mat á tekjum af sölu aðgöngumiða í\n\tinnlendum kvikmyndahúsum skal Kvikmyndamiðstöð líta til skrán­ingar í\n\tgagnagrunn Félags rétthafa í sjónvarps- og kvikmyndaiðnaði.\n</p>\n<p>\n\tHeimilt er að senda umsóknargögn vegna sýningarstyrkja með rafrænum hætti skv.\n\tnánari ákvörðun Kvikmyndamiðstöðvar Íslands um umsóknargögn.\n</p>\n<p>\n\tHafi umsækjandi þegar skilað inn viðeigandi gögnum til Kvikmyndamiðstöðvar\n\tÍslands vegna sama kvikmyndaverks á grundvelli kvikmyndalaga, nr. 137/2001 eða\n\tlaga um tímabundnar endur­greiðslur vegna kvikmyndagerðar á Íslandi nr.\n\t43/1999, þarf umsækjandi ekki að skila inn sömu umsóknar­gögnum á ný en getur\n\tgefið Kvikmyndamiðstöð heimild til að nýta gögn sem þegar hafa verið lögð\n\tfram. Hér er vísað til staðfestra ársreikninga framleiðslufélaga kvikmynda,\n\teða annarra gagna eftir því sem við á.\n</p>\n<h3 class="article__title">\n\t7. gr.\n\t<em class="article__name">Forsendur greiðslu sýningarstyrks og endurgreiðslu.</em>\n</h3>\n<p>\n\tEndurkrefja ber sýningarstyrk ef í ljós kemur að styrkþegi hafi vísvitandi\n\tveitt rangar eða villandi upplýsingar eða leynt upplýsingum sem hafa áhrif á\n\tveitingu og fjárhæð styrksins.\n</p>\n<p>\n\tKomi í ljós að fjárhæð sýningarstyrks er umfram það hámark sem kveðið er á um\n\tí 4. gr. skal endurkrefja styrkþega um styrkinn í heild.\n</p>\n<p>\n\tÁður en Kvikmyndamiðstöð tekur ákvörðun um að endurkrefja styrk skv. 2. og 3.\n\tmgr. skal styrk­þega tilkynnt um að mál hans sé til athugunar og honum gefinn\n\tkostur á að láta í té gögn og skýr­ingar vegna málsins. Um meðferð\n\tendurkröfumáls gilda ákvæði stjórnsýslulaga nr. 37/1993, m.a. um afturköllun\n\tstjórnvaldsákvörðunar, andmælarétt, birtingu ákvörðunar og\n\tkæru­leiðbein­ingar.\n</p>\n<h3 class="article__title">\n\t8. gr. <em class="article__name">Gildistaka.</em>\n</h3>\n<p>\n\tReglugerð þessi er sett á grundvelli 13. gr. laga nr. 137/2001 og með hliðsjón\n\taf reglugerð nr. 1165/2015 um gildistöku reglugerða framkvæmdastjórnarinnar\n\t(ESB) um ríkisaðstoð, og öðlast þegar gildi.\n</p>\n<p class="Dags" align="center">\n\t<em>Mennta- og menningarmálaráðuneytinu, 21. desember 2018.</em>\n</p>\n<p align="center">\n\t<strong>Lilja D. Alfreðsdóttir.</strong>\n</p>\n<p align="right">\n\t<em>Ásta Magnúsdóttir.</em>\n</p>\n',
    drafting_notes: '',
    ideal_publish_date: '2021-08-08',
    ministry: 'fsr',
    signature_date: '2021-08-08',
    signature_text:
      '<p class="Dags" style="text-align: center;"><em>Dómsmálaráðuneytinu, 23. febrúar 2022.</em></p><p class="FHUndirskr" style="text-align: center;">f.h.r.</p><p class="Undirritun" style="text-align: center;"><strong>NAFN</strong><br>⸻ráðherra.</p><p class="Undirritun" style="text-align: right;"><em>NAFN.</em></p>',
    signed_document_url:
      'https://files.reglugerd.is/admin-drafts/a1fd62db-18a6-4741-88eb-a7b7a7e05833/download-1.pdf',
    effective_date: '2021-08-08',
    type: 'base',
    authors: [TEST_USERS.utlond, TEST_USERS.afrika],
    law_chapters: ['01', '02a'],
    fast_track: true,
  },
  {
    id: '32e191a3-497c-46e4-ae10-8ba579f07f28',
    drafting_status: 'draft',
    title:
      'Reglugerð um gjaldtöku í höfnum vegna losunar, móttöku, meðhöndlunar og förgunar úrgangs og farmleifa frá skipum.',
    text: '<h3 class="article__title">1. gr. <em class="article__name">Gjaldtaka.</em></h3>\n<p>\n\tInnheimta skal gjald af skipum vegna losunar úrgangs og farmleifa í höfn sbr.\n\tf-lið 1. tölul. 2. mgr. 17. gr. hafnalaga, nr. 61/2003. Gjaldið skal standa\n\tstraum af kostnaði við móttöku, meðhöndlun og förgun úrgangs og farmleifa frá\n\tskipum.\n</p>\n<p>\n\tFjárhæð gjalds skal ákveðin í gjaldskrá hafna. Í gjaldskránni skal jafnframt\n\tgetið um lágmarksgjald fyrir losun úrgangs í höfn. Við ákvörðun fjárhæðar\n\tgjalds skal tekið mið af fjölda skipakoma þeirra skipa sem ætlað er að greiða\n\tgjaldið í höfn árið áður, auk viðmiða skv. 3. gr. reglugerðar þessarar.\n</p>\n<h3 class="article__title">\n\t2. gr. <em class="article__name">Lækkun gjalds.</em>\n</h3>\n<p>\n\tGjald skv. 1. gr. reglugerðar þessarar má lækka ef umhverfisstjórnun, hönnun,\n\tbúnaður og starfræksla skips er með þeim hætti að skipstjóri geti sýnt fram á\n\tað minni úrgangur verði til um borð.\n</p>\n<h3 class="article__title">\n\t3. gr. <em class="article__name">Viðmið við ákvörðun fjárhæðar gjalds.</em>\n</h3>\n<p>\n\tÞegar gjald er ákvarðað vegna losunar olíu, sorps og skólps í höfnum skal\n\tgjald reiknað á hvert brúttótonn skips auk þess sem mögulegt er að taka mið af\n\tfjölda daga frá síðustu viðkomu í höfn.\n</p>\n<p>\n\tÞegar um er að ræða skemmtiferðaskip og farþegaferjur með fleiri en 500\n\tfarþega er heimilt að innheimta gjald vegna losunar sorps/skólps sem tekur mið\n\taf fjölda farþega/áhafnar um borð auk fjölda daga frá síðustu viðkomu í höfn\n\ten gjald fyrir losun olíuúrgangs skal greitt skv. 1. mgr.\n</p>\n<h3 class="article__title">\n\t4. gr. <em class="article__name">Undanþágur.</em>\n</h3>\n<p>\n\tUndanþegin gjaldtöku skv. 1. gr. reglugerðar þessarar, eru fiskiskip,\n\tskemmtibátar sem ekki mega flytja fleiri en 12 farþega, herskip, hjálparskip í\n\tflota, skip sem þjónusta fiskeldi, skip í ríkiseign og skip í ríkisrekstri sem\n\tnýtt eru í þágu hins opinbera.\n</p>\n<p>\n\tHafnarstjóri getur veitt undanþágu frá greiðslu gjalds skv. 1. gr. reglugerðar\n\tþessarar, skipum í áætlunarsiglingum sem hafa tíða og reglulega viðkomu í\n\thöfnum og sýna fram á trygga afhendingu úrgangs og greiðslu gjalda í einhverri\n\thöfn á siglingaleiðinni sbr. 2. málsl. 3. mgr. 11. gr. c. laga nr. 33/2004 um\n\tvarnir gegn mengun hafs og stranda.\n</p>\n<p>\n\tSkip sem keypt hafa olíu sem greitt hefur verið af úrvinnslugjald skv. lögum\n\tnr. 162/2002 um úrvinnslugjald eru undanskilin greiðslu gjalds vegna losunar\n\tolíu. Í þeim tilvikum er undanþága skv. 2. málsl. 3. mgr. 8. gr. laga um\n\túrvinnslugjald á við þarf ekki að greiða gjald vegna losunar olíu.\n</p>\n<h3 class="article__title">5. gr.</h3>\n<p>\n\tReglugerð þessi, er sett með stoð í 4. mgr. 11. gr. c laga nr. 33/2004 um\n\tvarnir gegn mengun hafs og stranda.\n</p>\n<p>Fellir brott reglugerð nr. 105/2020</p>\n<p>Fellir brott reglugerð nr. 111/2020</p>\n<p>Reglugerðin öðlast gildi 31. desember 2014.</p>\n<p class="Dags" align="center">\n\t<em>Umhverfis- og auðlindaráðuneytinu, 19. desember 2014.</em>\n</p>\n<p align="center">\n\t<strong>Sigurður Ingi Jóhannsson.</strong>\n</p>\n<p align="right">\n\t<em>Hugi Ólafsson.</em>\n</p>\n',
    drafting_notes: '',
    ideal_publish_date: '2021-08-09',
    ministry: 'fsr',
    signature_date: '2021-08-09',
    effective_date: '2021-08-09',
    type: 'base',
    authors: [TEST_USERS.amerika],
    law_chapters: ['01a'],
  },
  {
    id: 'b99f6276-68ff-4ac7-a9f4-b42d522922e8',
    drafting_status: 'shipped',
    title:
      'Reglugerð um eftirlitsstaði erlendra skipa vegna veiða og siglinga í íslenskri fiskveiðilögsögu.',
    text: '<h3 class="article__title">\n\t1. gr. <em class="article__name">Gildissvið.</em>\n</h3>\n<p>\n\tReglugerð þessi gildir um öll erlend skip sem stunda veiðar innan íslenskrar\n\tfiskveiði­lögsögu með leyfi íslenskra stjórnvalda.\n</p>\n<h3 class="article__title">\n\t2. gr. <em class="article__name">Eftirlitsstaðir.</em>\n</h3>\n<p>\n\tErlend skip á leið til veiðisvæðis, skulu áður en veiðar í fiskveiðilögsögu\n\tÍslands hefjast og á leið út úr fiskveiðilögsögu Íslands, sigla um einn af\n\tneðangreindum eftirlitsstöðum:\n</p>\n<ol type="A">\n\t<li>69°15′N - 013°00′V</li>\n\t<li>68°30′N - 011°00′V</li>\n\t<li>67°30′N - 010°00′V</li>\n\t<li>66°15′N - 009°00′V</li>\n\t<li>65°00′N - 010°00′V</li>\n\t<li>64°00′N - 012°00′V</li>\n\t<li>63°30′N - 016°00′V</li>\n\t<li>63°00′N - 020°00′V</li>\n\t<li>63°30′N - 025°00′V</li>\n\t<li>65°00′N - 027°00′V</li>\n</ol>\n<p>\n\tLandhelgisgæslu Íslands er heimilt að ákveða hvaða eftirlitsstað veiðiskip\n\tskal sigla um. Heimilt er með samþykki Landhelgisgæslunnar að halda til\n\tannarra eftirlitsstaða. Einnig er Landhelgisgæslunni heimilt að ákveða aðra\n\teftirlitsstaði en þá sem tilgreindir eru í 1. mgr., t.d. vegna staðsetningar\n\tveiðisvæðis. Óheimilt er að yfirgefa eftirlitsstað nema með samþykki\n\tLandhelgisgæslu Íslands.\n</p>\n<h3 class="article__title">\n\t3. gr.\n\t<em class="article__name">Sjálfvirkur fjarskiptabúnaður - fjareftirlit.</em>\n</h3>\n<p>\n\tÖll erlend skip sem stunda veiðar innan íslenskrar fiskveiðilögsögu, skulu\n\tbúin fjar­skipta­búnaði sem sendir upplýsingar um staðsetningu skips, stefnu\n\tog hraða með sjálf­virkum hætti á klukkustundar fresti til sameiginlegrar\n\teftirlitsstöðvar Landhelgisgæslu og Fiski­stofu.\n</p>\n<h3 class="article__title">\n\t4. gr. <em class="article__name">Undanþáguheimildir.</em>\n</h3>\n<p>\n\tHeimilt er að veita undanþágu frá ákvæðum 2. gr. hafi aðilar gert samkomulag\n\tþar um.\n</p>\n<h3 class="article__title">5. gr. <em class="article__name">Viðurlög.</em></h3>\n<p>\n\tBrot á reglugerð þessari varða viðurlögum samkvæmt ákvæðum laga nr. 22, 8.\n\tapríl 1998, um veiðar og vinnslu erlendra skipa í fiskveiðilögsögu Íslands,\n\tmeð síðari breyt­ingum.\n</p>\n<h3 class="article__title">\n\t6. gr. <em class="article__name">Gildistaka.</em>\n</h3>\n<p>\n\tReglugerð þessi er sett skv. 9. gr. laga nr. 22, 8. apríl 1998, um veiðar og\n\tvinnslu erlendra skipa í fiskveiðilandhelgi Íslands, með síðari breytingum,\n\ttil þess að öðlast þegar gildi og birtist til eftirbreytni öllum þeim sem hlut\n\teiga að máli.\n</p>\n<p class="Dags" align="center">\n\t<em>Atvinnuvega- og nýsköpunarráðuneytinu, 18. desember 2013.</em>\n</p>\n<p class="FHUndirskr" align="center">\n\tF. h. sjávarútvegs- og landbúnaðarráðherra,\n</p>\n<p align="center">\n\t<strong>Kristján Freyr Helgason.</strong>\n</p>\n<p align="right">\n\t<em>Ásta Einarsdóttir.</em>\n</p>\n',
    drafting_notes: '',
    ideal_publish_date: '2021-09-09',
    ministry: 'Dómsmálaráðuneyti',
    signature_date: '2021-09-09',
    signature_text:
      '<p class="Dags" style="text-align: center;"><em>Dómsmálaráðuneytinu, 23. febrúar 2022.</em></p><p class="FHUndirskr" style="text-align: center;">f.h.r.</p><p class="Undirritun" style="text-align: center;"><strong>NAFN</strong><br>⸻ráðherra.</p><p class="Undirritun" style="text-align: right;"><em>NAFN.</em></p>',
    signed_document_url:
      'https://files.reglugerd.is/admin-drafts/a1fd62db-18a6-4741-88eb-a7b7a7e05833/download-1.pdf',
    effective_date: '2021-09-09',
    type: 'base',
    authors: [TEST_USERS.afrika],
    law_chapters: ['04', '05c'],
  },
  {
    id: 'a0bdbe60-2aa3-4036-80d1-8a3d448312d1',
    drafting_status: 'proposal',
    title:
      'Reglugerð um (1.) breytingu á reglugerð nr. 980/2015 um meðferð varnarefna.',
    text: '<h3 class="article__title">1. gr.</h3>\n<p>Ákvæði til bráðabirgða I í reglugerðinni orðist svo:</p>\n<p>\n\tÞrátt fyrir ákvæði 5. mgr. 6. gr. reglugerðarinnar er heimilt að endurnýja\n\tnotendaleyfi án þess að viðkomandi hafi aflað sér viðeigandi endurmenntunar,\n\ttil 31. desember 2021.\n</p>\n<h3 class="article__title">2. gr.</h3>\n<p>\n\tReglugerð þessi er sett með stoð í 15. tölul. 11. gr. efnalaga nr. 61/2013.\n</p>\n<p>Reglugerðin öðlast þegar gildi.</p>\n<p class="Dags" align="center">\n\t<em>Umhverfis- og auðlindaráðuneytinu, 9. febrúar 2018.</em>\n</p>\n<p align="center">\n\t<strong>Guðmundur Ingi Guðbrandsson.</strong>\n</p>\n<p align="right">\n\t<em>Sigríður Auður Arnardóttir.</em>\n</p>\n',
    drafting_notes: '',
    ideal_publish_date: '2021-08-08',
    ministry: 'avnsr',
    signature_date: '2021-08-08',
    effective_date: '2021-08-08',
    type: 'amending',
    authors: [TEST_USERS.amerika],
    law_chapters: ['01', '02'],
  },
  {
    id: '0cb3a68b-f368-4d01-a594-ba73e0dc396d',
    drafting_status: 'draft',
    title:
      'Reglugerð um breytingu á reglugerð um ákvörðun framlaga úr sveitarsjóði til sjálfstætt rekinna grunnskóla, nr. 1270/2016, ásamt síðari breytingum.',
    text: '<h3 class="article__title">1. gr.</h3>\n<p>\n\tÍ stað dagsetningarinnar 31. maí 2018 í ákvæði til bráðabirgða kemur: 1.\n\toktóber 2018.\n</p>\n<h3 class="article__title">2. gr.</h3>\n<p>\n\tReglugerð þessi, sem sett er með heimild í 43. gr. f. laga um grunnskóla nr.\n\t91/2008, með síðari breytingum, öðlast þegar gildi.\n</p>\n<p class="Dags" align="center">\n\t<em>Mennta- og menningarmálaráðuneytinu, 31. maí 2018.</em>\n</p>\n<p align="center">\n\t<strong>Lilja D. Alfreðsdóttir.</strong>\n</p>\n<p align="right">\n\t<em>Ásta Magnúsdóttir.</em>\n</p>\n',
    drafting_notes: '',
    ideal_publish_date: '2021-08-08',
    ministry: 'ssvr',
    signature_date: '2021-08-08',
    effective_date: '2021-08-08',
    type: 'amending',
    authors: [TEST_USERS.afrika],
    law_chapters: ['02'],
  },
  {
    id: 'cab3a212-5102-4a39-b791-3db74178545b',
    drafting_status: 'published',
    name: '1234/1234',
    title:
      'Einhver published Reglugerð um eftirlitsstaði erlendra skipa vegna veiða og siglinga í íslenskri fiskveiðilögsögu.',
    text: '<h3 class="article__title">\n\t1. gr. <em class="article__name">Gildissvið.</em>\n</h3>\n<p>\n\tReglugerð þessi gildir um öll erlend skip sem stunda veiðar innan íslenskrar\n\tfiskveiði­lögsögu með leyfi íslenskra stjórnvalda.\n</p>\n<h3 class="article__title">\n\t2. gr. <em class="article__name">Eftirlitsstaðir.</em>\n</h3>\n<p>\n\tErlend skip á leið til veiðisvæðis, skulu áður en veiðar í fiskveiðilögsögu\n\tÍslands hefjast og á leið út úr fiskveiðilögsögu Íslands, sigla um einn af\n\tneðangreindum eftirlitsstöðum:\n</p>\n<ol type="A">\n\t<li>69°15′N - 013°00′V</li>\n\t<li>68°30′N - 011°00′V</li>\n\t<li>67°30′N - 010°00′V</li>\n\t<li>66°15′N - 009°00′V</li>\n\t<li>65°00′N - 010°00′V</li>\n\t<li>64°00′N - 012°00′V</li>\n\t<li>63°30′N - 016°00′V</li>\n\t<li>63°00′N - 020°00′V</li>\n\t<li>63°30′N - 025°00′V</li>\n\t<li>65°00′N - 027°00′V</li>\n</ol>\n<p>\n\tLandhelgisgæslu Íslands er heimilt að ákveða hvaða eftirlitsstað veiðiskip\n\tskal sigla um. Heimilt er með samþykki Landhelgisgæslunnar að halda til\n\tannarra eftirlitsstaða. Einnig er Landhelgisgæslunni heimilt að ákveða aðra\n\teftirlitsstaði en þá sem tilgreindir eru í 1. mgr., t.d. vegna staðsetningar\n\tveiðisvæðis. Óheimilt er að yfirgefa eftirlitsstað nema með samþykki\n\tLandhelgisgæslu Íslands.\n</p>\n<h3 class="article__title">\n\t3. gr.\n\t<em class="article__name">Sjálfvirkur fjarskiptabúnaður - fjareftirlit.</em>\n</h3>\n<p>\n\tÖll erlend skip sem stunda veiðar innan íslenskrar fiskveiðilögsögu, skulu\n\tbúin fjar­skipta­búnaði sem sendir upplýsingar um staðsetningu skips, stefnu\n\tog hraða með sjálf­virkum hætti á klukkustundar fresti til sameiginlegrar\n\teftirlitsstöðvar Landhelgisgæslu og Fiski­stofu.\n</p>\n<h3 class="article__title">\n\t4. gr. <em class="article__name">Undanþáguheimildir.</em>\n</h3>\n<p>\n\tHeimilt er að veita undanþágu frá ákvæðum 2. gr. hafi aðilar gert samkomulag\n\tþar um.\n</p>\n<h3 class="article__title">5. gr. <em class="article__name">Viðurlög.</em></h3>\n<p>\n\tBrot á reglugerð þessari varða viðurlögum samkvæmt ákvæðum laga nr. 22, 8.\n\tapríl 1998, um veiðar og vinnslu erlendra skipa í fiskveiðilögsögu Íslands,\n\tmeð síðari breyt­ingum.\n</p>\n<h3 class="article__title">\n\t6. gr. <em class="article__name">Gildistaka.</em>\n</h3>\n<p>\n\tReglugerð þessi er sett skv. 9. gr. laga nr. 22, 8. apríl 1998, um veiðar og\n\tvinnslu erlendra skipa í fiskveiðilandhelgi Íslands, með síðari breytingum,\n\ttil þess að öðlast þegar gildi og birtist til eftirbreytni öllum þeim sem hlut\n\teiga að máli.\n</p>\n<p class="Dags" align="center">\n\t<em>Atvinnuvega- og nýsköpunarráðuneytinu, 18. desember 2013.</em>\n</p>\n<p class="FHUndirskr" align="center">\n\tF. h. sjávarútvegs- og landbúnaðarráðherra,\n</p>\n<p align="center">\n\t<strong>Kristján Freyr Helgason.</strong>\n</p>\n<p align="right">\n\t<em>Ásta Einarsdóttir.</em>\n</p>\n',
    drafting_notes: '',
    ideal_publish_date: '2021-09-09',
    ministry: 'Dómsmálaráðuneyti',
    signature_date: '2021-09-09',
    signature_text:
      '<p class="Dags" style="text-align: center;"><em>Dómsmálaráðuneytinu, 23. febrúar 2022.</em></p><p class="FHUndirskr" style="text-align: center;">f.h.r.</p><p class="Undirritun" style="text-align: center;"><strong>NAFN</strong><br>⸻ráðherra.</p><p class="Undirritun" style="text-align: right;"><em>NAFN.</em></p>',
    signed_document_url:
      'https://files.reglugerd.is/admin-drafts/a1fd62db-18a6-4741-88eb-a7b7a7e05833/download-1.pdf',
    effective_date: '2021-09-09',
    type: 'base',
    authors: [TEST_USERS.afrika],
    law_chapters: ['04', '05c'],
  },
]

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'draft_regulation',
      draftRegulationSeed,
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('draft_regulation', null, {})
  },
}
