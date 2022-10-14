'use strict'

module.exports = {
  up: (queryInterface) => {
    const applications = []
    const randomUuid = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0
          const v = c === 'x' ? r : (r & 0x3) | 0x8
          return v.toString(16)
        },
      )
    }

    const randomKennitala = () => {
      const year = Math.floor(Math.random() * 100)
      const month = Math.floor(Math.random() * 12) + 1
      const day = Math.floor(Math.random() * 28) + 1
      const lastFour = Math.floor(Math.random() * 10000)
      return `${year.toString().padStart(2, '0')}${month
        .toString()
        .padStart(2, '0')}${day
        .toString()
        .padStart(2, '0')}-${lastFour.toString().padStart(4, '0')}`
    }

    const randomPastDate = () => {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 100))
      return date
    }

    const randomPastdateLongAgo = () => {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 1000))
      return date
    }

    const answers = ` {
        "fakeData": {
          "useFakeData": "yes",
          "qualityPhoto": "no",
          "healthRemarks": "no",
          "currentLicense": "temp"
        },
        "applicationFor": "B-temp",
        "requirementsMet": true,
        "approveExternalData": true
      }`

    const externalData = `{
      "payment": {
        "data": [
          {
            "priceAmount": 8000,
            "chargeItemCode": "AY110",
            "chargeItemName": "Ökuskírteini",
            "performingOrgID": "6509142520"
          },
          {
            "priceAmount": 4000,
            "chargeItemCode": "AY114",
            "chargeItemName": "Bráðabirgðaökuskírteini",
            "performingOrgID": "6509142520"
          }
        ],
        "date": "2022-10-11T10:56:17.925Z",
        "status": "success"
      },
      "teachers": {
        "data": [
          { "name": "Agnar Þór Gunnlaugsson", "nationalId": "2201665119" },
          { "name": "Agnes Lóa Gunnarsdóttir", "nationalId": "1406992849" },
          { "name": "Alda Þuríður Jónsdóttir", "nationalId": "2104634539" },
          { "name": "Alfreð Birgisson", "nationalId": "1602763479" },
          { "name": "Ari Ingimundarson", "nationalId": "2904534379" },
          { "name": "Arnar Freyr Sigurðsson", "nationalId": "1011953179" },
          { "name": "Arnar Logi Valdimarsson", "nationalId": "2612912319" },
          { "name": "Arndís Hilmarsdóttir", "nationalId": "3001695629" },
          { "name": "Auðunn Eiríksson", "nationalId": "1710534129" },
          { "name": "Auður Yngvadóttir", "nationalId": "0106635479" },
          {
            "name": "Ágústa Hjördís Friðriksdóttir",
            "nationalId": "2704665249"
          },
          { "name": "Árni Ingólfsson", "nationalId": "0907482119" },
          { "name": "Ásdís Sveinsdóttir", "nationalId": "1505665099" },
          { "name": "Ásgeir Gunnarsson", "nationalId": "1212563559" },
          { "name": "Ásta Sóllilja Karlsdóttir", "nationalId": "1704815189" },
          { "name": "Baldur Vigfússon", "nationalId": "2212773259" },
          { "name": "Baldvin Elíasson", "nationalId": "0102775749" },
          { "name": "Baldvin Hallgrímsson", "nationalId": "1411685769" },
          { "name": "Bergur Hjaltason", "nationalId": "2002482019" },
          { "name": "Bergur Már Sigurðsson", "nationalId": "0310617849" },
          { "name": "Beyene Gailassie", "nationalId": "2006682359" },
          { "name": "Birgir Bjarnason", "nationalId": "1901472829" },
          { "name": "Birgir Rafn Arnþórsson", "nationalId": "1006813319" },
          { "name": "Birgir Örn Hreinsson", "nationalId": "2510612629" },
          {
            "name": "Birgitta María Vilbergsdóttir",
            "nationalId": "0912753769"
          },
          {
            "name": "Bjarki Heiðar Beck Brynjarsson",
            "nationalId": "1406724329"
          },
          { "name": "Bjarný Sigmarsdóttir", "nationalId": "1208672969" },
          {
            "name": "Bjarnþóra María Pálsdóttir",
            "nationalId": "0705715529"
          },
          { "name": "Björgvin Þór Guðnason", "nationalId": "0804665529" },
          { "name": "Björn Lúðvíksson", "nationalId": "2501594989" },
          { "name": "Björn Magnús Björgvinsson", "nationalId": "0210537599" },
          { "name": "Björn Vilhelm Magnússon", "nationalId": "1310703309" },
          { "name": "Bragi Jens Sigurvinsson", "nationalId": "1509482319" },
          {
            "name": "Brynjar Magnús Valdimarsson",
            "nationalId": "0109474489"
          },
          { "name": "Brynjúlfur Sigurðsson", "nationalId": "1904783439" },
          { "name": "Böðvar Sveinsson", "nationalId": "0802715819" },
          { "name": "Davíð Steinþór Ólafsson", "nationalId": "1509592769" },
          { "name": "Dýrfinna Sigurjónsdóttir", "nationalId": "3003715159" },
          { "name": "Eggert Bjarni Bogason", "nationalId": "2311912759" },
          { "name": "Eggert Valur Þorkelsson", "nationalId": "0905527169" },
          { "name": "Egill Bjarnason", "nationalId": "2006523639" },
          { "name": "Egill Rúnar Sigurðsson", "nationalId": "2908673479" },
          { "name": "Einar Bjarnason", "nationalId": "0412583069" },
          { "name": "Einar Guðmann Örnólfsson", "nationalId": "2102733799" },
          { "name": "Einar Ingþór Einarsson", "nationalId": "1412544729" },
          { "name": "Einar Rafn Haraldsson", "nationalId": "2502462509" },
          { "name": "Einar Viðarsson", "nationalId": "0610724039" },
          { "name": "Einvarður Jóhannsson", "nationalId": "0305685839" },
          { "name": "Eiríkur Hans Sigurðsson", "nationalId": "0405423619" },
          { "name": "Eiríkur Marteinn Tómasson", "nationalId": "0209582199" },
          { "name": "Elías Bragi Sólmundarson", "nationalId": "0407615869" },
          { "name": "Elín Esther Magnúsdóttir", "nationalId": "2108763249" },
          { "name": "Elsa Jóna Sveinsdóttir", "nationalId": "1505584339" },
          { "name": "Elvar Örn Erlingsson", "nationalId": "2806653559" },
          { "name": "Emanúel Ragnarsson", "nationalId": "1312412169" },
          { "name": "Erna Sigfúsdóttir", "nationalId": "2812693729" },
          { "name": "Eyvindur Bjarnason", "nationalId": "0510493309" },
          { "name": "Frímann Birgir Baldursson", "nationalId": "2406743439" },
          { "name": "Frímann Ólafsson", "nationalId": "2003573379" },
          { "name": "Georg Georgsson", "nationalId": "1708473779" },
          { "name": "Gísli Magnús Garðarsson", "nationalId": "1107453119" },
          { "name": "Grétar H Guðmundsson", "nationalId": "1108605959" },
          { "name": "Grétar Ingi Viðarsson", "nationalId": "1602654269" },
          { "name": "Gréta Björg Ólafsdóttir", "nationalId": "1210663359" },
          { "name": "Grímur Bjarndal Jónsson", "nationalId": "2506452799" },
          { "name": "Gunnar Hallsson", "nationalId": "3005483939" },
          { "name": "Gunnar Jóhannsson", "nationalId": "0705592269" },
          { "name": "Gunnar Theodór Gunnarsson", "nationalId": "1503604479" },
          { "name": "Gunnar Þór Jónsson", "nationalId": "1109524309" },
          {
            "name": "Gunnsteinn Rúnar Sigfússon",
            "nationalId": "2603784309"
          },
          { "name": "Guðbrandur Bogason", "nationalId": "0606432459" },
          { "name": "Guðjón Bjarki Guðjónsson", "nationalId": "0112873799" },
          { "name": "Guðjón Ólafur Magnússon", "nationalId": "0702546039" },
          { "name": "Guðjón Snæfeld Magnússon", "nationalId": "1203783339" },
          { "name": "Guðlaugur Magnús Ingason", "nationalId": "1005834299" },
          { "name": "Guðmundur Agnar Axelsson", "nationalId": "1409422199" },
          { "name": "Guðmundur A Arason", "nationalId": "0202404749" },
          {
            "name": "Guðmundur Friðgeir Guðmundsson",
            "nationalId": "0111714199"
          },
          { "name": "Guðmundur G Norðdahl", "nationalId": "1709502089" },
          { "name": "Guðmundur H Jónsson", "nationalId": "1811514049" },
          { "name": "Guðmundur H Sveinsson", "nationalId": "1904675629" },
          {
            "name": "Guðmundur Ingvar Kristófersson",
            "nationalId": "1202452609"
          },
          { "name": "Guðni Erlendsson", "nationalId": "2804784159" },
          { "name": "Guðni Sveinn Theodórsson", "nationalId": "2605675199" },
          {
            "name": "Guðný Ingibjörg Einarsdóttir",
            "nationalId": "0107632669"
          },
          { "name": "Guðríður Magnúsdóttir", "nationalId": "1704507799" },
          {
            "name": "Guðrún Björk Freysteinsdóttir",
            "nationalId": "0203804979"
          },
          {
            "name": "Guðrún Kristín Benediktsdóttir",
            "nationalId": "2304653049"
          },
          { "name": "Guðrún Sigurfinnsdóttir", "nationalId": "1206695329" },
          { "name": "Gústaf Bergmann Isaksen", "nationalId": "1701735389" },
          { "name": "Halldór Óskarsson", "nationalId": "0402535059" },
          { "name": "Halldór Pétur Ásgeirsson", "nationalId": "1705545749" },
          { "name": "Hannes Freyr Guðmundsson", "nationalId": "1607514529" },
          { "name": "Hannes Guðmundsson", "nationalId": "0801484379" },
          { "name": "Haukur Gíslason", "nationalId": "1012863559" },
          { "name": "Haukur Ívarsson", "nationalId": "1607474989" },
          { "name": "Haukur Vigfússon", "nationalId": "2912753469" },
          { "name": "Hákon Bjarnason", "nationalId": "2003602069" },
          { "name": "Heimir Heiðarsson", "nationalId": "1701764649" },
          { "name": "Heiða Millý Torfadóttir", "nationalId": "2505842619" },
          { "name": "Heiða Ósk Stefánsdóttir", "nationalId": "0101612079" },
          { "name": "Hildur Guðjónsdóttir", "nationalId": "1908793999" },
          { "name": "Hilmar Eide Harðarson", "nationalId": "0610452449" },
          { "name": "Hilmar Guðjónsson", "nationalId": "2812573079" },
          { "name": "Hjalti Enok Pálsson", "nationalId": "0302902839" },
          { "name": "Hlynur Gíslason", "nationalId": "2306803379" },
          { "name": "Hlynur Hafberg Snorrason", "nationalId": "2802634949" },
          { "name": "Hólmar Björn Sigþórsson", "nationalId": "1706623509" },
          { "name": "Hreinn Halldórsson", "nationalId": "0303493859" },
          { "name": "Hreiðar Gíslason", "nationalId": "3107402769" },
          { "name": "Hreiðar Páll Haraldsson", "nationalId": "2601663449" },
          { "name": "Hreiðar Örn Steinþórsson", "nationalId": "1304775939" },
          {
            "name": "Hreiðar Örn Zoega Stefánsson",
            "nationalId": "1410622399"
          },
          { "name": "Hörður Hinriksson", "nationalId": "3005607849" },
          { "name": "Hörður Lilliendahl", "nationalId": "2708633029" },
          { "name": "Hörður Ævar Ingason", "nationalId": "1703614829" },
          { "name": "Inga Þórey Ingólfsdóttir", "nationalId": "1007803569" },
          { "name": "Ingunn Óladóttir", "nationalId": "1608733459" },
          { "name": "Ingvar Björnsson", "nationalId": "0211462859" },
          { "name": "Jana Thuy Helgadóttir", "nationalId": "2109894129" },
          { "name": "Jens Karl Ísfjörð", "nationalId": "1307783139" },
          { "name": "Jóhannes Högnason", "nationalId": "1305684249" },
          { "name": "Jóhannes Þórhallsson", "nationalId": "2004794919" },
          { "name": "Jóhann Davíðsson", "nationalId": "0207552619" },
          { "name": "Jóhann Geir Guðjónsson", "nationalId": "2402482209" },
          { "name": "Jóhann Hilmar Haraldsson", "nationalId": "0807764389" },
          { "name": "Jóhann Þór Sigfússon", "nationalId": "3012693239" },
          { "name": "Jónas Helgason", "nationalId": "1509544879" },
          { "name": "Jónas Traustason", "nationalId": "2208495709" },
          { "name": "Jónas Þór Karlsson", "nationalId": "1811903029" },
          { "name": "Jón Ármann Arason", "nationalId": "0807460089" },
          { "name": "Jón Árni Konráðsson", "nationalId": "0407593449" },
          { "name": "Jón Eiríksson", "nationalId": "0502632829" },
          { "name": "Jón F Sigurðsson", "nationalId": "1702522929" },
          { "name": "Jón Hannes Kristjánsson", "nationalId": "0710703019" },
          { "name": "Jón Haukur Edwald", "nationalId": "0211543509" },
          { "name": "Jón Haukur Stefánsson", "nationalId": "0501735349" },
          { "name": "Jón Pétur Pétursson", "nationalId": "0607835789" },
          { "name": "Jón Sigurgeir Jónsson", "nationalId": "2608804389" },
          { "name": "Jón Sigurðsson", "nationalId": "1912494299" },
          { "name": "Karen Lind Ólafsdóttir", "nationalId": "0604793729" },
          { "name": "Karlotta Einarsdóttir", "nationalId": "2004842669" },
          { "name": "Karl Einar Óskarsson", "nationalId": "0208637819" },
          { "name": "Kjartan Halldórsson", "nationalId": "1203644489" },
          { "name": "Kjartan Þórðarson", "nationalId": "0912533219" },
          { "name": "Knútur Sæberg Halldórsson", "nationalId": "1904576059" },
          { "name": "Kristinn Jóhannesson", "nationalId": "1609642949" },
          { "name": "Kristinn M Bárðarson", "nationalId": "0301572739" },
          { "name": "Kristinn Örn Jónsson", "nationalId": "1404502519" },
          {
            "name": "Kristín Helgadóttir Ísfeld",
            "nationalId": "1404557099"
          },
          {
            "name": "Kristín Sigurlaug Brandsdóttir",
            "nationalId": "2208647319"
          },
          { "name": "Kristján Björnsson", "nationalId": "0811437069" },
          { "name": "Kristján Freyr Geirsson", "nationalId": "2905674169" },
          { "name": "Kristján Jóhann Bjarnason", "nationalId": "1507863129" },
          { "name": "Kristján Kristjánsson", "nationalId": "0104543289" },
          { "name": "Kristján Pétursson", "nationalId": "2604713339" },
          {
            "name": "Kristján Tryggvi Sigurðsson",
            "nationalId": "1701623239"
          },
          { "name": "Kristófer Kristófersson", "nationalId": "1701623079" },
          { "name": "Kristófer Sæmundsson", "nationalId": "1612582889" },
          { "name": "Lárus Árni Wöhler", "nationalId": "3005663089" },
          { "name": "Linda Björk Thorlacius", "nationalId": "1911775929" },
          { "name": "Lúðvík Eiðsson", "nationalId": "0810504069" },
          { "name": "Magnús Gísli Magnússon", "nationalId": "0509472549" },
          { "name": "Magnús Sigurgeirsson", "nationalId": "0610573319" },
          {
            "name": "Margrét Arna Eggertsdóttir",
            "nationalId": "1401804919"
          },
          { "name": "Margrét Ósk Reynisdóttir", "nationalId": "0906724449" },
          {
            "name": "Margrét Sigríður Þórisdóttir",
            "nationalId": "2502614899"
          },
          { "name": "María Carmen Magnúsdóttir", "nationalId": "2212785349" },
          { "name": "Marteinn Guðmundsson", "nationalId": "2412663389" },
          { "name": "Marthe Sördal", "nationalId": "0303866129" },
          { "name": "Njáll Gunnlaugsson", "nationalId": "2407675709" },
          { "name": "Oddný Friðriksdóttir", "nationalId": "2401784279" },
          { "name": "Oddur Hallgrímsson", "nationalId": "1205602129" },
          { "name": "Ólafur Árni Traustason", "nationalId": "0610592029" },
          { "name": "Ólafur Björn Lárusson", "nationalId": "1909585239" },
          { "name": "Ólafur Gunnar Sævarsson", "nationalId": "1706805379" },
          { "name": "Ólafur H Sigurðsson", "nationalId": "2705542379" },
          { "name": "Páll Andrés Andrésson", "nationalId": "1506393019" },
          { "name": "Páll Jakob Malmberg", "nationalId": "0401695129" },
          { "name": "Páll Sigvaldason", "nationalId": "1502604859" },
          {
            "name": "Pálmi Bjartmar Aðalbergsson",
            "nationalId": "2308474879"
          },
          { "name": "Pétur Friðrik Þórðarson", "nationalId": "2505512749" },
          { "name": "Pétur Guðráð Pétursson", "nationalId": "2507514279" },
          { "name": "Pétur Kristjánsson", "nationalId": "0308457819" },
          {
            "name": "Pétur Vilhjálmur Hallgrímsson",
            "nationalId": "2509552359"
          },
          { "name": "Reginn Þórarinsson", "nationalId": "1106862779" },
          { "name": "Robert Radoslaw Klukowski", "nationalId": "2808722109" },
          { "name": "Róbert Sigurðarson", "nationalId": "2907744709" },
          { "name": "Sandra Lóa Gunnarsdóttir", "nationalId": "1301783409" },
          {
            "name": "Selma Sigurbjörg Erludóttir",
            "nationalId": "1708625039"
          },
          { "name": "Sigfinnur Mar Þrúðmarsson", "nationalId": "2412882429" },
          { "name": "Sigríður Eiríksdóttir", "nationalId": "1906725069" },
          { "name": "Sigríður Garðarsdóttir", "nationalId": "2712624269" },
          { "name": "Sigríður Ólafsdóttir", "nationalId": "1306584829" },
          {
            "name": "Sigrún Berglind Ragnarsdóttir",
            "nationalId": "0803704909"
          },
          { "name": "Sigrún Sjöfn Ámundadóttir", "nationalId": "2311883129" },
          {
            "name": "Sigurbjörg Sól Ólafsdóttir",
            "nationalId": "2809774549"
          },
          { "name": "Sigurjón Páll Hauksson", "nationalId": "2002484309" },
          {
            "name": "Sigurlína Freysteinsdóttir",
            "nationalId": "1103823169"
          },
          {
            "name": "Sigurlína Jóh Jóhannesdóttir",
            "nationalId": "2809574619"
          },
          { "name": "Sigurður Brynjarsson", "nationalId": "1211683919" },
          { "name": "Sigurður E Steinsson", "nationalId": "1410654919" },
          { "name": "Sigurður Jónasson", "nationalId": "1311664009" },
          {
            "name": "Sigurður Óskar Leví Gíslason",
            "nationalId": "0708453699"
          },
          { "name": "Sigurður Pétursson", "nationalId": "3103502149" },
          { "name": "Sigurður Sigurbjörnsson", "nationalId": "2905765399" },
          { "name": "Sigurður Valur Jakobsson", "nationalId": "0909775049" },
          { "name": "Sigurður Þorsteinsson", "nationalId": "0709575669" },
          { "name": "Sigurður Þór Elísson", "nationalId": "1202805119" },
          {
            "name": "Smári Arnfjörð Kristjánsson",
            "nationalId": "2605472329"
          },
          { "name": "Snorri Þorgeir Rútsson", "nationalId": "1002537719" },
          { "name": "Sólveig Anna Brynjudóttir", "nationalId": "2009883539" },
          { "name": "Stefanía Guðjónsdóttir", "nationalId": "2609705189" },
          { "name": "Steindór Tryggvason", "nationalId": "0909575039" },
          { "name": "Steingrímur A Jónsson", "nationalId": "0803624989" },
          {
            "name": "Steinþór Darri Þorsteinsson",
            "nationalId": "1807704619"
          },
          { "name": "Steinþór Þráinsson", "nationalId": "0410544179" },
          { "name": "Sturlaugur Stefánsson", "nationalId": "2704484459" },
          { "name": "Sumarliði Guðbjörnsson", "nationalId": "0202513609" },
          { "name": "Svanberg Sigurgeirsson", "nationalId": "2611503019" },
          {
            "name": "Svandís Jóna Sigurðardóttir",
            "nationalId": "1604754479"
          },
          { "name": "Svavar Atli Birgisson", "nationalId": "0105803079" },
          { "name": "Svavar Stefánsson", "nationalId": "1403492919" },
          { "name": "Svavar Svavarsson", "nationalId": "1808527519" },
          {
            "name": "Svava Dögg Björgvinsdóttir",
            "nationalId": "2006942799"
          },
          { "name": "Svava Jóhannesdóttir", "nationalId": "1801643329" },
          {
            "name": "Sveinbjörn Sigurður Hilmarsson",
            "nationalId": "1102733639"
          },
          { "name": "Sveinn Alfreðsson", "nationalId": "1003602259" },
          { "name": "Sveinn Ingimarsson", "nationalId": "2101624379" },
          { "name": "Sverrir Guðfinnsson", "nationalId": "0207724339" },
          { "name": "Sverrir H Björnsson", "nationalId": "2011505909" },
          { "name": "Sævar Már Guðmundsson", "nationalId": "1707795419" },
          { "name": "Telma Dögg Guðlaugsdóttir", "nationalId": "0201803239" },
          { "name": "Torfi Elís Andrésson", "nationalId": "1604502159" },
          { "name": "Torfi Karl Karlsson", "nationalId": "0412525029" },
          { "name": "Torfi Pálsson", "nationalId": "2602774219" },
          { "name": "Vagn Kristjánsson", "nationalId": "3110805719" },
          { "name": "Valdemar Þór Viðarsson", "nationalId": "0111724079" },
          { "name": "Valdimar Runólfsson", "nationalId": "0908625889" },
          { "name": "Valdimar Þorgeirsson", "nationalId": "2808543369" },
          { "name": "Valur Bergmundsson", "nationalId": "1607725149" },
          { "name": "Valur Örn Arnarson", "nationalId": "2907734669" },
          { "name": "Vilhjálmur Árnason", "nationalId": "2910834989" },
          { "name": "Vilhjálmur Gíslason", "nationalId": "2308594939" },
          { "name": "Viðar Einarsson", "nationalId": "2106422349" },
          {
            "name": "Þorkell Vilhelm Þorsteinsson",
            "nationalId": "1211562299"
          },
          {
            "name": "Þorsteinn Bjarki Pétursson",
            "nationalId": "2301963709"
          },
          { "name": "Þorsteinn Ó Alexandersson", "nationalId": "2305572099" },
          { "name": "Þorsteinn Sveinn Karlsson", "nationalId": "2105633699" },
          { "name": "Þorvaldur Finnbogason", "nationalId": "0211513009" },
          { "name": "Þorvaldur Guðmundsson", "nationalId": "1305502319" },
          { "name": "Þorvaldur S Benediktsson", "nationalId": "2809596269" },
          { "name": "Þórgunnur Þórðardóttir", "nationalId": "1810883709" },
          { "name": "Þór Arnarsson", "nationalId": "1801625189" },
          { "name": "Þórður Bogason", "nationalId": "0112595619" },
          { "name": "Þráinn Elíasson", "nationalId": "1606473459" },
          {
            "name": "Þrúðmar Sigurður Þrúðmarsson",
            "nationalId": "1412545109"
          },
          {
            "name": "Þuríður Berglind Ægisdóttir",
            "nationalId": "1908695209"
          },
          { "name": "Ævar Friðriksson", "nationalId": "0402487819" },
          { "name": "Ölver Thorstensen", "nationalId": "1502625269" },
          { "name": "Örn Kristján Arnarson", "nationalId": "2304675609" }
        ],
        "date": "2022-10-11T10:56:19.140Z",
        "status": "success"
      },
      "teachers1": {
        "data": [
          { "name": "Agnar Þór Gunnlaugsson", "nationalId": "2201665119" },
          { "name": "Agnes Lóa Gunnarsdóttir", "nationalId": "1406992849" },
          { "name": "Alda Þuríður Jónsdóttir", "nationalId": "2104634539" },
          { "name": "Alfreð Birgisson", "nationalId": "1602763479" },
          { "name": "Ari Ingimundarson", "nationalId": "2904534379" },
          { "name": "Arnar Freyr Sigurðsson", "nationalId": "1011953179" },
          { "name": "Arnar Logi Valdimarsson", "nationalId": "2612912319" },
          { "name": "Arndís Hilmarsdóttir", "nationalId": "3001695629" },
          { "name": "Auðunn Eiríksson", "nationalId": "1710534129" },
          { "name": "Auður Yngvadóttir", "nationalId": "0106635479" },
          {
            "name": "Ágústa Hjördís Friðriksdóttir",
            "nationalId": "2704665249"
          },
          { "name": "Árni Ingólfsson", "nationalId": "0907482119" },
          { "name": "Ásdís Sveinsdóttir", "nationalId": "1505665099" },
          { "name": "Ásgeir Gunnarsson", "nationalId": "1212563559" },
          { "name": "Ásta Sóllilja Karlsdóttir", "nationalId": "1704815189" },
          { "name": "Baldur Vigfússon", "nationalId": "2212773259" },
          { "name": "Baldvin Elíasson", "nationalId": "0102775749" },
          { "name": "Baldvin Hallgrímsson", "nationalId": "1411685769" },
          { "name": "Bergur Hjaltason", "nationalId": "2002482019" },
          { "name": "Bergur Már Sigurðsson", "nationalId": "0310617849" },
          { "name": "Beyene Gailassie", "nationalId": "2006682359" },
          { "name": "Birgir Bjarnason", "nationalId": "1901472829" },
          { "name": "Birgir Rafn Arnþórsson", "nationalId": "1006813319" },
          { "name": "Birgir Örn Hreinsson", "nationalId": "2510612629" },
          {
            "name": "Birgitta María Vilbergsdóttir",
            "nationalId": "0912753769"
          },
          {
            "name": "Bjarki Heiðar Beck Brynjarsson",
            "nationalId": "1406724329"
          },
          { "name": "Bjarný Sigmarsdóttir", "nationalId": "1208672969" },
          {
            "name": "Bjarnþóra María Pálsdóttir",
            "nationalId": "0705715529"
          },
          { "name": "Björgvin Þór Guðnason", "nationalId": "0804665529" },
          { "name": "Björn Lúðvíksson", "nationalId": "2501594989" },
          { "name": "Björn Magnús Björgvinsson", "nationalId": "0210537599" },
          { "name": "Björn Vilhelm Magnússon", "nationalId": "1310703309" },
          { "name": "Bragi Jens Sigurvinsson", "nationalId": "1509482319" },
          {
            "name": "Brynjar Magnús Valdimarsson",
            "nationalId": "0109474489"
          },
          { "name": "Brynjúlfur Sigurðsson", "nationalId": "1904783439" },
          { "name": "Böðvar Sveinsson", "nationalId": "0802715819" },
          { "name": "Davíð Steinþór Ólafsson", "nationalId": "1509592769" },
          { "name": "Dýrfinna Sigurjónsdóttir", "nationalId": "3003715159" },
          { "name": "Eggert Bjarni Bogason", "nationalId": "2311912759" },
          { "name": "Eggert Valur Þorkelsson", "nationalId": "0905527169" },
          { "name": "Egill Bjarnason", "nationalId": "2006523639" },
          { "name": "Egill Rúnar Sigurðsson", "nationalId": "2908673479" },
          { "name": "Einar Bjarnason", "nationalId": "0412583069" },
          { "name": "Einar Guðmann Örnólfsson", "nationalId": "2102733799" },
          { "name": "Einar Ingþór Einarsson", "nationalId": "1412544729" },
          { "name": "Einar Rafn Haraldsson", "nationalId": "2502462509" },
          { "name": "Einar Viðarsson", "nationalId": "0610724039" },
          { "name": "Einvarður Jóhannsson", "nationalId": "0305685839" },
          { "name": "Eiríkur Hans Sigurðsson", "nationalId": "0405423619" },
          { "name": "Eiríkur Marteinn Tómasson", "nationalId": "0209582199" },
          { "name": "Elías Bragi Sólmundarson", "nationalId": "0407615869" },
          { "name": "Elín Esther Magnúsdóttir", "nationalId": "2108763249" },
          { "name": "Elsa Jóna Sveinsdóttir", "nationalId": "1505584339" },
          { "name": "Elvar Örn Erlingsson", "nationalId": "2806653559" },
          { "name": "Emanúel Ragnarsson", "nationalId": "1312412169" },
          { "name": "Erna Sigfúsdóttir", "nationalId": "2812693729" },
          { "name": "Eyvindur Bjarnason", "nationalId": "0510493309" },
          { "name": "Frímann Birgir Baldursson", "nationalId": "2406743439" },
          { "name": "Frímann Ólafsson", "nationalId": "2003573379" },
          { "name": "Georg Georgsson", "nationalId": "1708473779" },
          { "name": "Gísli Magnús Garðarsson", "nationalId": "1107453119" },
          { "name": "Grétar H Guðmundsson", "nationalId": "1108605959" },
          { "name": "Grétar Ingi Viðarsson", "nationalId": "1602654269" },
          { "name": "Gréta Björg Ólafsdóttir", "nationalId": "1210663359" },
          { "name": "Grímur Bjarndal Jónsson", "nationalId": "2506452799" },
          { "name": "Gunnar Hallsson", "nationalId": "3005483939" },
          { "name": "Gunnar Jóhannsson", "nationalId": "0705592269" },
          { "name": "Gunnar Theodór Gunnarsson", "nationalId": "1503604479" },
          { "name": "Gunnar Þór Jónsson", "nationalId": "1109524309" },
          {
            "name": "Gunnsteinn Rúnar Sigfússon",
            "nationalId": "2603784309"
          },
          { "name": "Guðbrandur Bogason", "nationalId": "0606432459" },
          { "name": "Guðjón Bjarki Guðjónsson", "nationalId": "0112873799" },
          { "name": "Guðjón Ólafur Magnússon", "nationalId": "0702546039" },
          { "name": "Guðjón Snæfeld Magnússon", "nationalId": "1203783339" },
          { "name": "Guðlaugur Magnús Ingason", "nationalId": "1005834299" },
          { "name": "Guðmundur Agnar Axelsson", "nationalId": "1409422199" },
          { "name": "Guðmundur A Arason", "nationalId": "0202404749" },
          {
            "name": "Guðmundur Friðgeir Guðmundsson",
            "nationalId": "0111714199"
          },
          { "name": "Guðmundur G Norðdahl", "nationalId": "1709502089" },
          { "name": "Guðmundur H Jónsson", "nationalId": "1811514049" },
          { "name": "Guðmundur H Sveinsson", "nationalId": "1904675629" },
          {
            "name": "Guðmundur Ingvar Kristófersson",
            "nationalId": "1202452609"
          },
          { "name": "Guðni Erlendsson", "nationalId": "2804784159" },
          { "name": "Guðni Sveinn Theodórsson", "nationalId": "2605675199" },
          {
            "name": "Guðný Ingibjörg Einarsdóttir",
            "nationalId": "0107632669"
          },
          { "name": "Guðríður Magnúsdóttir", "nationalId": "1704507799" },
          {
            "name": "Guðrún Björk Freysteinsdóttir",
            "nationalId": "0203804979"
          },
          {
            "name": "Guðrún Kristín Benediktsdóttir",
            "nationalId": "2304653049"
          },
          { "name": "Guðrún Sigurfinnsdóttir", "nationalId": "1206695329" },
          { "name": "Gústaf Bergmann Isaksen", "nationalId": "1701735389" },
          { "name": "Halldór Óskarsson", "nationalId": "0402535059" },
          { "name": "Halldór Pétur Ásgeirsson", "nationalId": "1705545749" },
          { "name": "Hannes Freyr Guðmundsson", "nationalId": "1607514529" },
          { "name": "Hannes Guðmundsson", "nationalId": "0801484379" },
          { "name": "Haukur Gíslason", "nationalId": "1012863559" },
          { "name": "Haukur Ívarsson", "nationalId": "1607474989" },
          { "name": "Haukur Vigfússon", "nationalId": "2912753469" },
          { "name": "Hákon Bjarnason", "nationalId": "2003602069" },
          { "name": "Heimir Heiðarsson", "nationalId": "1701764649" },
          { "name": "Heiða Millý Torfadóttir", "nationalId": "2505842619" },
          { "name": "Heiða Ósk Stefánsdóttir", "nationalId": "0101612079" },
          { "name": "Hildur Guðjónsdóttir", "nationalId": "1908793999" },
          { "name": "Hilmar Eide Harðarson", "nationalId": "0610452449" },
          { "name": "Hilmar Guðjónsson", "nationalId": "2812573079" },
          { "name": "Hjalti Enok Pálsson", "nationalId": "0302902839" },
          { "name": "Hlynur Gíslason", "nationalId": "2306803379" },
          { "name": "Hlynur Hafberg Snorrason", "nationalId": "2802634949" },
          { "name": "Hólmar Björn Sigþórsson", "nationalId": "1706623509" },
          { "name": "Hreinn Halldórsson", "nationalId": "0303493859" },
          { "name": "Hreiðar Gíslason", "nationalId": "3107402769" },
          { "name": "Hreiðar Páll Haraldsson", "nationalId": "2601663449" },
          { "name": "Hreiðar Örn Steinþórsson", "nationalId": "1304775939" },
          {
            "name": "Hreiðar Örn Zoega Stefánsson",
            "nationalId": "1410622399"
          },
          { "name": "Hörður Hinriksson", "nationalId": "3005607849" },
          { "name": "Hörður Lilliendahl", "nationalId": "2708633029" },
          { "name": "Hörður Ævar Ingason", "nationalId": "1703614829" },
          { "name": "Inga Þórey Ingólfsdóttir", "nationalId": "1007803569" },
          { "name": "Ingunn Óladóttir", "nationalId": "1608733459" },
          { "name": "Ingvar Björnsson", "nationalId": "0211462859" },
          { "name": "Jana Thuy Helgadóttir", "nationalId": "2109894129" },
          { "name": "Jens Karl Ísfjörð", "nationalId": "1307783139" },
          { "name": "Jóhannes Högnason", "nationalId": "1305684249" },
          { "name": "Jóhannes Þórhallsson", "nationalId": "2004794919" },
          { "name": "Jóhann Davíðsson", "nationalId": "0207552619" },
          { "name": "Jóhann Geir Guðjónsson", "nationalId": "2402482209" },
          { "name": "Jóhann Hilmar Haraldsson", "nationalId": "0807764389" },
          { "name": "Jóhann Þór Sigfússon", "nationalId": "3012693239" },
          { "name": "Jónas Helgason", "nationalId": "1509544879" },
          { "name": "Jónas Traustason", "nationalId": "2208495709" },
          { "name": "Jónas Þór Karlsson", "nationalId": "1811903029" },
          { "name": "Jón Ármann Arason", "nationalId": "0807460089" },
          { "name": "Jón Árni Konráðsson", "nationalId": "0407593449" },
          { "name": "Jón Eiríksson", "nationalId": "0502632829" },
          { "name": "Jón F Sigurðsson", "nationalId": "1702522929" },
          { "name": "Jón Hannes Kristjánsson", "nationalId": "0710703019" },
          { "name": "Jón Haukur Edwald", "nationalId": "0211543509" },
          { "name": "Jón Haukur Stefánsson", "nationalId": "0501735349" },
          { "name": "Jón Pétur Pétursson", "nationalId": "0607835789" },
          { "name": "Jón Sigurgeir Jónsson", "nationalId": "2608804389" },
          { "name": "Jón Sigurðsson", "nationalId": "1912494299" },
          { "name": "Karen Lind Ólafsdóttir", "nationalId": "0604793729" },
          { "name": "Karlotta Einarsdóttir", "nationalId": "2004842669" },
          { "name": "Karl Einar Óskarsson", "nationalId": "0208637819" },
          { "name": "Kjartan Halldórsson", "nationalId": "1203644489" },
          { "name": "Kjartan Þórðarson", "nationalId": "0912533219" },
          { "name": "Knútur Sæberg Halldórsson", "nationalId": "1904576059" },
          { "name": "Kristinn Jóhannesson", "nationalId": "1609642949" },
          { "name": "Kristinn M Bárðarson", "nationalId": "0301572739" },
          { "name": "Kristinn Örn Jónsson", "nationalId": "1404502519" },
          {
            "name": "Kristín Helgadóttir Ísfeld",
            "nationalId": "1404557099"
          },
          {
            "name": "Kristín Sigurlaug Brandsdóttir",
            "nationalId": "2208647319"
          },
          { "name": "Kristján Björnsson", "nationalId": "0811437069" },
          { "name": "Kristján Freyr Geirsson", "nationalId": "2905674169" },
          { "name": "Kristján Jóhann Bjarnason", "nationalId": "1507863129" },
          { "name": "Kristján Kristjánsson", "nationalId": "0104543289" },
          { "name": "Kristján Pétursson", "nationalId": "2604713339" },
          {
            "name": "Kristján Tryggvi Sigurðsson",
            "nationalId": "1701623239"
          },
          { "name": "Kristófer Kristófersson", "nationalId": "1701623079" },
          { "name": "Kristófer Sæmundsson", "nationalId": "1612582889" },
          { "name": "Lárus Árni Wöhler", "nationalId": "3005663089" },
          { "name": "Linda Björk Thorlacius", "nationalId": "1911775929" },
          { "name": "Lúðvík Eiðsson", "nationalId": "0810504069" },
          { "name": "Magnús Gísli Magnússon", "nationalId": "0509472549" },
          { "name": "Magnús Sigurgeirsson", "nationalId": "0610573319" },
          {
            "name": "Margrét Arna Eggertsdóttir",
            "nationalId": "1401804919"
          },
          { "name": "Margrét Ósk Reynisdóttir", "nationalId": "0906724449" },
          {
            "name": "Margrét Sigríður Þórisdóttir",
            "nationalId": "2502614899"
          },
          { "name": "María Carmen Magnúsdóttir", "nationalId": "2212785349" },
          { "name": "Marteinn Guðmundsson", "nationalId": "2412663389" },
          { "name": "Marthe Sördal", "nationalId": "0303866129" },
          { "name": "Njáll Gunnlaugsson", "nationalId": "2407675709" },
          { "name": "Oddný Friðriksdóttir", "nationalId": "2401784279" },
          { "name": "Oddur Hallgrímsson", "nationalId": "1205602129" },
          { "name": "Ólafur Árni Traustason", "nationalId": "0610592029" },
          { "name": "Ólafur Björn Lárusson", "nationalId": "1909585239" },
          { "name": "Ólafur Gunnar Sævarsson", "nationalId": "1706805379" },
          { "name": "Ólafur H Sigurðsson", "nationalId": "2705542379" },
          { "name": "Páll Andrés Andrésson", "nationalId": "1506393019" },
          { "name": "Páll Jakob Malmberg", "nationalId": "0401695129" },
          { "name": "Páll Sigvaldason", "nationalId": "1502604859" },
          {
            "name": "Pálmi Bjartmar Aðalbergsson",
            "nationalId": "2308474879"
          },
          { "name": "Pétur Friðrik Þórðarson", "nationalId": "2505512749" },
          { "name": "Pétur Guðráð Pétursson", "nationalId": "2507514279" },
          { "name": "Pétur Kristjánsson", "nationalId": "0308457819" },
          {
            "name": "Pétur Vilhjálmur Hallgrímsson",
            "nationalId": "2509552359"
          },
          { "name": "Reginn Þórarinsson", "nationalId": "1106862779" },
          { "name": "Robert Radoslaw Klukowski", "nationalId": "2808722109" },
          { "name": "Róbert Sigurðarson", "nationalId": "2907744709" },
          { "name": "Sandra Lóa Gunnarsdóttir", "nationalId": "1301783409" },
          {
            "name": "Selma Sigurbjörg Erludóttir",
            "nationalId": "1708625039"
          },
          { "name": "Sigfinnur Mar Þrúðmarsson", "nationalId": "2412882429" },
          { "name": "Sigríður Eiríksdóttir", "nationalId": "1906725069" },
          { "name": "Sigríður Garðarsdóttir", "nationalId": "2712624269" },
          { "name": "Sigríður Ólafsdóttir", "nationalId": "1306584829" },
          {
            "name": "Sigrún Berglind Ragnarsdóttir",
            "nationalId": "0803704909"
          },
          { "name": "Sigrún Sjöfn Ámundadóttir", "nationalId": "2311883129" },
          {
            "name": "Sigurbjörg Sól Ólafsdóttir",
            "nationalId": "2809774549"
          },
          { "name": "Sigurjón Páll Hauksson", "nationalId": "2002484309" },
          {
            "name": "Sigurlína Freysteinsdóttir",
            "nationalId": "1103823169"
          },
          {
            "name": "Sigurlína Jóh Jóhannesdóttir",
            "nationalId": "2809574619"
          },
          { "name": "Sigurður Brynjarsson", "nationalId": "1211683919" },
          { "name": "Sigurður E Steinsson", "nationalId": "1410654919" },
          { "name": "Sigurður Jónasson", "nationalId": "1311664009" },
          {
            "name": "Sigurður Óskar Leví Gíslason",
            "nationalId": "0708453699"
          },
          { "name": "Sigurður Pétursson", "nationalId": "3103502149" },
          { "name": "Sigurður Sigurbjörnsson", "nationalId": "2905765399" },
          { "name": "Sigurður Valur Jakobsson", "nationalId": "0909775049" },
          { "name": "Sigurður Þorsteinsson", "nationalId": "0709575669" },
          { "name": "Sigurður Þór Elísson", "nationalId": "1202805119" },
          {
            "name": "Smári Arnfjörð Kristjánsson",
            "nationalId": "2605472329"
          },
          { "name": "Snorri Þorgeir Rútsson", "nationalId": "1002537719" },
          { "name": "Sólveig Anna Brynjudóttir", "nationalId": "2009883539" },
          { "name": "Stefanía Guðjónsdóttir", "nationalId": "2609705189" },
          { "name": "Steindór Tryggvason", "nationalId": "0909575039" },
          { "name": "Steingrímur A Jónsson", "nationalId": "0803624989" },
          {
            "name": "Steinþór Darri Þorsteinsson",
            "nationalId": "1807704619"
          },
          { "name": "Steinþór Þráinsson", "nationalId": "0410544179" },
          { "name": "Sturlaugur Stefánsson", "nationalId": "2704484459" },
          { "name": "Sumarliði Guðbjörnsson", "nationalId": "0202513609" },
          { "name": "Svanberg Sigurgeirsson", "nationalId": "2611503019" },
          {
            "name": "Svandís Jóna Sigurðardóttir",
            "nationalId": "1604754479"
          },
          { "name": "Svavar Atli Birgisson", "nationalId": "0105803079" },
          { "name": "Svavar Stefánsson", "nationalId": "1403492919" },
          { "name": "Svavar Svavarsson", "nationalId": "1808527519" },
          {
            "name": "Svava Dögg Björgvinsdóttir",
            "nationalId": "2006942799"
          },
          { "name": "Svava Jóhannesdóttir", "nationalId": "1801643329" },
          {
            "name": "Sveinbjörn Sigurður Hilmarsson",
            "nationalId": "1102733639"
          },
          { "name": "Sveinn Alfreðsson", "nationalId": "1003602259" },
          { "name": "Sveinn Ingimarsson", "nationalId": "2101624379" },
          { "name": "Sverrir Guðfinnsson", "nationalId": "0207724339" },
          { "name": "Sverrir H Björnsson", "nationalId": "2011505909" },
          { "name": "Sævar Már Guðmundsson", "nationalId": "1707795419" },
          { "name": "Telma Dögg Guðlaugsdóttir", "nationalId": "0201803239" },
          { "name": "Torfi Elís Andrésson", "nationalId": "1604502159" },
          { "name": "Torfi Karl Karlsson", "nationalId": "0412525029" },
          { "name": "Torfi Pálsson", "nationalId": "2602774219" },
          { "name": "Vagn Kristjánsson", "nationalId": "3110805719" },
          { "name": "Valdemar Þór Viðarsson", "nationalId": "0111724079" },
          { "name": "Valdimar Runólfsson", "nationalId": "0908625889" },
          { "name": "Valdimar Þorgeirsson", "nationalId": "2808543369" },
          { "name": "Valur Bergmundsson", "nationalId": "1607725149" },
          { "name": "Valur Örn Arnarson", "nationalId": "2907734669" },
          { "name": "Vilhjálmur Árnason", "nationalId": "2910834989" },
          { "name": "Vilhjálmur Gíslason", "nationalId": "2308594939" },
          { "name": "Viðar Einarsson", "nationalId": "2106422349" },
          {
            "name": "Þorkell Vilhelm Þorsteinsson",
            "nationalId": "1211562299"
          },
          {
            "name": "Þorsteinn Bjarki Pétursson",
            "nationalId": "2301963709"
          },
          { "name": "Þorsteinn Ó Alexandersson", "nationalId": "2305572099" },
          { "name": "Þorsteinn Sveinn Karlsson", "nationalId": "2105633699" },
          { "name": "Þorvaldur Finnbogason", "nationalId": "0211513009" },
          { "name": "Þorvaldur Guðmundsson", "nationalId": "1305502319" },
          { "name": "Þorvaldur S Benediktsson", "nationalId": "2809596269" },
          { "name": "Þórgunnur Þórðardóttir", "nationalId": "1810883709" },
          { "name": "Þór Arnarsson", "nationalId": "1801625189" },
          { "name": "Þórður Bogason", "nationalId": "0112595619" },
          { "name": "Þráinn Elíasson", "nationalId": "1606473459" },
          {
            "name": "Þrúðmar Sigurður Þrúðmarsson",
            "nationalId": "1412545109"
          },
          {
            "name": "Þuríður Berglind Ægisdóttir",
            "nationalId": "1908695209"
          },
          { "name": "Ævar Friðriksson", "nationalId": "0402487819" },
          { "name": "Ölver Thorstensen", "nationalId": "1502625269" },
          { "name": "Örn Kristján Arnarson", "nationalId": "2304675609" }
        ]
      },
      "teachers2": {
        "data": [
          { "name": "Agnar Þór Gunnlaugsson", "nationalId": "2201665119" },
          { "name": "Agnes Lóa Gunnarsdóttir", "nationalId": "1406992849" },
          { "name": "Alda Þuríður Jónsdóttir", "nationalId": "2104634539" },
          { "name": "Alfreð Birgisson", "nationalId": "1602763479" },
          { "name": "Ari Ingimundarson", "nationalId": "2904534379" },
          { "name": "Arnar Freyr Sigurðsson", "nationalId": "1011953179" },
          { "name": "Arnar Logi Valdimarsson", "nationalId": "2612912319" },
          { "name": "Arndís Hilmarsdóttir", "nationalId": "3001695629" },
          { "name": "Auðunn Eiríksson", "nationalId": "1710534129" },
          { "name": "Auður Yngvadóttir", "nationalId": "0106635479" },
          {
            "name": "Ágústa Hjördís Friðriksdóttir",
            "nationalId": "2704665249"
          },
          { "name": "Árni Ingólfsson", "nationalId": "0907482119" },
          { "name": "Ásdís Sveinsdóttir", "nationalId": "1505665099" },
          { "name": "Ásgeir Gunnarsson", "nationalId": "1212563559" },
          { "name": "Ásta Sóllilja Karlsdóttir", "nationalId": "1704815189" },
          { "name": "Baldur Vigfússon", "nationalId": "2212773259" },
          { "name": "Baldvin Elíasson", "nationalId": "0102775749" },
          { "name": "Baldvin Hallgrímsson", "nationalId": "1411685769" },
          { "name": "Bergur Hjaltason", "nationalId": "2002482019" },
          { "name": "Bergur Már Sigurðsson", "nationalId": "0310617849" },
          { "name": "Beyene Gailassie", "nationalId": "2006682359" },
          { "name": "Birgir Bjarnason", "nationalId": "1901472829" },
          { "name": "Birgir Rafn Arnþórsson", "nationalId": "1006813319" },
          { "name": "Birgir Örn Hreinsson", "nationalId": "2510612629" },
          {
            "name": "Birgitta María Vilbergsdóttir",
            "nationalId": "0912753769"
          },
          {
            "name": "Bjarki Heiðar Beck Brynjarsson",
            "nationalId": "1406724329"
          },
          { "name": "Bjarný Sigmarsdóttir", "nationalId": "1208672969" },
          {
            "name": "Bjarnþóra María Pálsdóttir",
            "nationalId": "0705715529"
          },
          { "name": "Björgvin Þór Guðnason", "nationalId": "0804665529" },
          { "name": "Björn Lúðvíksson", "nationalId": "2501594989" },
          { "name": "Björn Magnús Björgvinsson", "nationalId": "0210537599" },
          { "name": "Björn Vilhelm Magnússon", "nationalId": "1310703309" },
          { "name": "Bragi Jens Sigurvinsson", "nationalId": "1509482319" },
          {
            "name": "Brynjar Magnús Valdimarsson",
            "nationalId": "0109474489"
          },
          { "name": "Brynjúlfur Sigurðsson", "nationalId": "1904783439" },
          { "name": "Böðvar Sveinsson", "nationalId": "0802715819" },
          { "name": "Davíð Steinþór Ólafsson", "nationalId": "1509592769" },
          { "name": "Dýrfinna Sigurjónsdóttir", "nationalId": "3003715159" },
          { "name": "Eggert Bjarni Bogason", "nationalId": "2311912759" },
          { "name": "Eggert Valur Þorkelsson", "nationalId": "0905527169" },
          { "name": "Egill Bjarnason", "nationalId": "2006523639" },
          { "name": "Egill Rúnar Sigurðsson", "nationalId": "2908673479" },
          { "name": "Einar Bjarnason", "nationalId": "0412583069" },
          { "name": "Einar Guðmann Örnólfsson", "nationalId": "2102733799" },
          { "name": "Einar Ingþór Einarsson", "nationalId": "1412544729" },
          { "name": "Einar Rafn Haraldsson", "nationalId": "2502462509" },
          { "name": "Einar Viðarsson", "nationalId": "0610724039" },
          { "name": "Einvarður Jóhannsson", "nationalId": "0305685839" },
          { "name": "Eiríkur Hans Sigurðsson", "nationalId": "0405423619" },
          { "name": "Eiríkur Marteinn Tómasson", "nationalId": "0209582199" },
          { "name": "Elías Bragi Sólmundarson", "nationalId": "0407615869" },
          { "name": "Elín Esther Magnúsdóttir", "nationalId": "2108763249" },
          { "name": "Elsa Jóna Sveinsdóttir", "nationalId": "1505584339" },
          { "name": "Elvar Örn Erlingsson", "nationalId": "2806653559" },
          { "name": "Emanúel Ragnarsson", "nationalId": "1312412169" },
          { "name": "Erna Sigfúsdóttir", "nationalId": "2812693729" },
          { "name": "Eyvindur Bjarnason", "nationalId": "0510493309" },
          { "name": "Frímann Birgir Baldursson", "nationalId": "2406743439" },
          { "name": "Frímann Ólafsson", "nationalId": "2003573379" },
          { "name": "Georg Georgsson", "nationalId": "1708473779" },
          { "name": "Gísli Magnús Garðarsson", "nationalId": "1107453119" },
          { "name": "Grétar H Guðmundsson", "nationalId": "1108605959" },
          { "name": "Grétar Ingi Viðarsson", "nationalId": "1602654269" },
          { "name": "Gréta Björg Ólafsdóttir", "nationalId": "1210663359" },
          { "name": "Grímur Bjarndal Jónsson", "nationalId": "2506452799" },
          { "name": "Gunnar Hallsson", "nationalId": "3005483939" },
          { "name": "Gunnar Jóhannsson", "nationalId": "0705592269" },
          { "name": "Gunnar Theodór Gunnarsson", "nationalId": "1503604479" },
          { "name": "Gunnar Þór Jónsson", "nationalId": "1109524309" },
          {
            "name": "Gunnsteinn Rúnar Sigfússon",
            "nationalId": "2603784309"
          },
          { "name": "Guðbrandur Bogason", "nationalId": "0606432459" },
          { "name": "Guðjón Bjarki Guðjónsson", "nationalId": "0112873799" },
          { "name": "Guðjón Ólafur Magnússon", "nationalId": "0702546039" },
          { "name": "Guðjón Snæfeld Magnússon", "nationalId": "1203783339" },
          { "name": "Guðlaugur Magnús Ingason", "nationalId": "1005834299" },
          { "name": "Guðmundur Agnar Axelsson", "nationalId": "1409422199" },
          { "name": "Guðmundur A Arason", "nationalId": "0202404749" },
          {
            "name": "Guðmundur Friðgeir Guðmundsson",
            "nationalId": "0111714199"
          },
          { "name": "Guðmundur G Norðdahl", "nationalId": "1709502089" },
          { "name": "Guðmundur H Jónsson", "nationalId": "1811514049" },
          { "name": "Guðmundur H Sveinsson", "nationalId": "1904675629" },
          {
            "name": "Guðmundur Ingvar Kristófersson",
            "nationalId": "1202452609"
          },
          { "name": "Guðni Erlendsson", "nationalId": "2804784159" },
          { "name": "Guðni Sveinn Theodórsson", "nationalId": "2605675199" },
          {
            "name": "Guðný Ingibjörg Einarsdóttir",
            "nationalId": "0107632669"
          },
          { "name": "Guðríður Magnúsdóttir", "nationalId": "1704507799" },
          {
            "name": "Guðrún Björk Freysteinsdóttir",
            "nationalId": "0203804979"
          },
          {
            "name": "Guðrún Kristín Benediktsdóttir",
            "nationalId": "2304653049"
          },
          { "name": "Guðrún Sigurfinnsdóttir", "nationalId": "1206695329" },
          { "name": "Gústaf Bergmann Isaksen", "nationalId": "1701735389" },
          { "name": "Halldór Óskarsson", "nationalId": "0402535059" },
          { "name": "Halldór Pétur Ásgeirsson", "nationalId": "1705545749" },
          { "name": "Hannes Freyr Guðmundsson", "nationalId": "1607514529" },
          { "name": "Hannes Guðmundsson", "nationalId": "0801484379" },
          { "name": "Haukur Gíslason", "nationalId": "1012863559" },
          { "name": "Haukur Ívarsson", "nationalId": "1607474989" },
          { "name": "Haukur Vigfússon", "nationalId": "2912753469" },
          { "name": "Hákon Bjarnason", "nationalId": "2003602069" },
          { "name": "Heimir Heiðarsson", "nationalId": "1701764649" },
          { "name": "Heiða Millý Torfadóttir", "nationalId": "2505842619" },
          { "name": "Heiða Ósk Stefánsdóttir", "nationalId": "0101612079" },
          { "name": "Hildur Guðjónsdóttir", "nationalId": "1908793999" },
          { "name": "Hilmar Eide Harðarson", "nationalId": "0610452449" },
          { "name": "Hilmar Guðjónsson", "nationalId": "2812573079" },
          { "name": "Hjalti Enok Pálsson", "nationalId": "0302902839" },
          { "name": "Hlynur Gíslason", "nationalId": "2306803379" },
          { "name": "Hlynur Hafberg Snorrason", "nationalId": "2802634949" },
          { "name": "Hólmar Björn Sigþórsson", "nationalId": "1706623509" },
          { "name": "Hreinn Halldórsson", "nationalId": "0303493859" },
          { "name": "Hreiðar Gíslason", "nationalId": "3107402769" },
          { "name": "Hreiðar Páll Haraldsson", "nationalId": "2601663449" },
          { "name": "Hreiðar Örn Steinþórsson", "nationalId": "1304775939" },
          {
            "name": "Hreiðar Örn Zoega Stefánsson",
            "nationalId": "1410622399"
          },
          { "name": "Hörður Hinriksson", "nationalId": "3005607849" },
          { "name": "Hörður Lilliendahl", "nationalId": "2708633029" },
          { "name": "Hörður Ævar Ingason", "nationalId": "1703614829" },
          { "name": "Inga Þórey Ingólfsdóttir", "nationalId": "1007803569" },
          { "name": "Ingunn Óladóttir", "nationalId": "1608733459" },
          { "name": "Ingvar Björnsson", "nationalId": "0211462859" },
          { "name": "Jana Thuy Helgadóttir", "nationalId": "2109894129" },
          { "name": "Jens Karl Ísfjörð", "nationalId": "1307783139" },
          { "name": "Jóhannes Högnason", "nationalId": "1305684249" },
          { "name": "Jóhannes Þórhallsson", "nationalId": "2004794919" },
          { "name": "Jóhann Davíðsson", "nationalId": "0207552619" },
          { "name": "Jóhann Geir Guðjónsson", "nationalId": "2402482209" },
          { "name": "Jóhann Hilmar Haraldsson", "nationalId": "0807764389" },
          { "name": "Jóhann Þór Sigfússon", "nationalId": "3012693239" },
          { "name": "Jónas Helgason", "nationalId": "1509544879" },
          { "name": "Jónas Traustason", "nationalId": "2208495709" },
          { "name": "Jónas Þór Karlsson", "nationalId": "1811903029" },
          { "name": "Jón Ármann Arason", "nationalId": "0807460089" },
          { "name": "Jón Árni Konráðsson", "nationalId": "0407593449" },
          { "name": "Jón Eiríksson", "nationalId": "0502632829" },
          { "name": "Jón F Sigurðsson", "nationalId": "1702522929" },
          { "name": "Jón Hannes Kristjánsson", "nationalId": "0710703019" },
          { "name": "Jón Haukur Edwald", "nationalId": "0211543509" },
          { "name": "Jón Haukur Stefánsson", "nationalId": "0501735349" },
          { "name": "Jón Pétur Pétursson", "nationalId": "0607835789" },
          { "name": "Jón Sigurgeir Jónsson", "nationalId": "2608804389" },
          { "name": "Jón Sigurðsson", "nationalId": "1912494299" },
          { "name": "Karen Lind Ólafsdóttir", "nationalId": "0604793729" },
          { "name": "Karlotta Einarsdóttir", "nationalId": "2004842669" },
          { "name": "Karl Einar Óskarsson", "nationalId": "0208637819" },
          { "name": "Kjartan Halldórsson", "nationalId": "1203644489" },
          { "name": "Kjartan Þórðarson", "nationalId": "0912533219" },
          { "name": "Knútur Sæberg Halldórsson", "nationalId": "1904576059" },
          { "name": "Kristinn Jóhannesson", "nationalId": "1609642949" },
          { "name": "Kristinn M Bárðarson", "nationalId": "0301572739" },
          { "name": "Kristinn Örn Jónsson", "nationalId": "1404502519" },
          {
            "name": "Kristín Helgadóttir Ísfeld",
            "nationalId": "1404557099"
          },
          {
            "name": "Kristín Sigurlaug Brandsdóttir",
            "nationalId": "2208647319"
          },
          { "name": "Kristján Björnsson", "nationalId": "0811437069" },
          { "name": "Kristján Freyr Geirsson", "nationalId": "2905674169" },
          { "name": "Kristján Jóhann Bjarnason", "nationalId": "1507863129" },
          { "name": "Kristján Kristjánsson", "nationalId": "0104543289" },
          { "name": "Kristján Pétursson", "nationalId": "2604713339" },
          {
            "name": "Kristján Tryggvi Sigurðsson",
            "nationalId": "1701623239"
          },
          { "name": "Kristófer Kristófersson", "nationalId": "1701623079" },
          { "name": "Kristófer Sæmundsson", "nationalId": "1612582889" },
          { "name": "Lárus Árni Wöhler", "nationalId": "3005663089" },
          { "name": "Linda Björk Thorlacius", "nationalId": "1911775929" },
          { "name": "Lúðvík Eiðsson", "nationalId": "0810504069" },
          { "name": "Magnús Gísli Magnússon", "nationalId": "0509472549" },
          { "name": "Magnús Sigurgeirsson", "nationalId": "0610573319" },
          {
            "name": "Margrét Arna Eggertsdóttir",
            "nationalId": "1401804919"
          },
          { "name": "Margrét Ósk Reynisdóttir", "nationalId": "0906724449" },
          {
            "name": "Margrét Sigríður Þórisdóttir",
            "nationalId": "2502614899"
          },
          { "name": "María Carmen Magnúsdóttir", "nationalId": "2212785349" },
          { "name": "Marteinn Guðmundsson", "nationalId": "2412663389" },
          { "name": "Marthe Sördal", "nationalId": "0303866129" },
          { "name": "Njáll Gunnlaugsson", "nationalId": "2407675709" },
          { "name": "Oddný Friðriksdóttir", "nationalId": "2401784279" },
          { "name": "Oddur Hallgrímsson", "nationalId": "1205602129" },
          { "name": "Ólafur Árni Traustason", "nationalId": "0610592029" },
          { "name": "Ólafur Björn Lárusson", "nationalId": "1909585239" },
          { "name": "Ólafur Gunnar Sævarsson", "nationalId": "1706805379" },
          { "name": "Ólafur H Sigurðsson", "nationalId": "2705542379" },
          { "name": "Páll Andrés Andrésson", "nationalId": "1506393019" },
          { "name": "Páll Jakob Malmberg", "nationalId": "0401695129" },
          { "name": "Páll Sigvaldason", "nationalId": "1502604859" },
          {
            "name": "Pálmi Bjartmar Aðalbergsson",
            "nationalId": "2308474879"
          },
          { "name": "Pétur Friðrik Þórðarson", "nationalId": "2505512749" },
          { "name": "Pétur Guðráð Pétursson", "nationalId": "2507514279" },
          { "name": "Pétur Kristjánsson", "nationalId": "0308457819" },
          {
            "name": "Pétur Vilhjálmur Hallgrímsson",
            "nationalId": "2509552359"
          },
          { "name": "Reginn Þórarinsson", "nationalId": "1106862779" },
          { "name": "Robert Radoslaw Klukowski", "nationalId": "2808722109" },
          { "name": "Róbert Sigurðarson", "nationalId": "2907744709" },
          { "name": "Sandra Lóa Gunnarsdóttir", "nationalId": "1301783409" },
          {
            "name": "Selma Sigurbjörg Erludóttir",
            "nationalId": "1708625039"
          },
          { "name": "Sigfinnur Mar Þrúðmarsson", "nationalId": "2412882429" },
          { "name": "Sigríður Eiríksdóttir", "nationalId": "1906725069" },
          { "name": "Sigríður Garðarsdóttir", "nationalId": "2712624269" },
          { "name": "Sigríður Ólafsdóttir", "nationalId": "1306584829" },
          {
            "name": "Sigrún Berglind Ragnarsdóttir",
            "nationalId": "0803704909"
          },
          { "name": "Sigrún Sjöfn Ámundadóttir", "nationalId": "2311883129" },
          {
            "name": "Sigurbjörg Sól Ólafsdóttir",
            "nationalId": "2809774549"
          },
          { "name": "Sigurjón Páll Hauksson", "nationalId": "2002484309" },
          {
            "name": "Sigurlína Freysteinsdóttir",
            "nationalId": "1103823169"
          },
          {
            "name": "Sigurlína Jóh Jóhannesdóttir",
            "nationalId": "2809574619"
          },
          { "name": "Sigurður Brynjarsson", "nationalId": "1211683919" },
          { "name": "Sigurður E Steinsson", "nationalId": "1410654919" },
          { "name": "Sigurður Jónasson", "nationalId": "1311664009" },
          {
            "name": "Sigurður Óskar Leví Gíslason",
            "nationalId": "0708453699"
          },
          { "name": "Sigurður Pétursson", "nationalId": "3103502149" },
          { "name": "Sigurður Sigurbjörnsson", "nationalId": "2905765399" },
          { "name": "Sigurður Valur Jakobsson", "nationalId": "0909775049" },
          { "name": "Sigurður Þorsteinsson", "nationalId": "0709575669" },
          { "name": "Sigurður Þór Elísson", "nationalId": "1202805119" },
          {
            "name": "Smári Arnfjörð Kristjánsson",
            "nationalId": "2605472329"
          },
          { "name": "Snorri Þorgeir Rútsson", "nationalId": "1002537719" },
          { "name": "Sólveig Anna Brynjudóttir", "nationalId": "2009883539" },
          { "name": "Stefanía Guðjónsdóttir", "nationalId": "2609705189" },
          { "name": "Steindór Tryggvason", "nationalId": "0909575039" },
          { "name": "Steingrímur A Jónsson", "nationalId": "0803624989" },
          {
            "name": "Steinþór Darri Þorsteinsson",
            "nationalId": "1807704619"
          },
          { "name": "Steinþór Þráinsson", "nationalId": "0410544179" },
          { "name": "Sturlaugur Stefánsson", "nationalId": "2704484459" },
          { "name": "Sumarliði Guðbjörnsson", "nationalId": "0202513609" },
          { "name": "Svanberg Sigurgeirsson", "nationalId": "2611503019" },
          {
            "name": "Svandís Jóna Sigurðardóttir",
            "nationalId": "1604754479"
          },
          { "name": "Svavar Atli Birgisson", "nationalId": "0105803079" },
          { "name": "Svavar Stefánsson", "nationalId": "1403492919" },
          { "name": "Svavar Svavarsson", "nationalId": "1808527519" },
          {
            "name": "Svava Dögg Björgvinsdóttir",
            "nationalId": "2006942799"
          },
          { "name": "Svava Jóhannesdóttir", "nationalId": "1801643329" },
          {
            "name": "Sveinbjörn Sigurður Hilmarsson",
            "nationalId": "1102733639"
          },
          { "name": "Sveinn Alfreðsson", "nationalId": "1003602259" },
          { "name": "Sveinn Ingimarsson", "nationalId": "2101624379" },
          { "name": "Sverrir Guðfinnsson", "nationalId": "0207724339" },
          { "name": "Sverrir H Björnsson", "nationalId": "2011505909" },
          { "name": "Sævar Már Guðmundsson", "nationalId": "1707795419" },
          { "name": "Telma Dögg Guðlaugsdóttir", "nationalId": "0201803239" },
          { "name": "Torfi Elís Andrésson", "nationalId": "1604502159" },
          { "name": "Torfi Karl Karlsson", "nationalId": "0412525029" },
          { "name": "Torfi Pálsson", "nationalId": "2602774219" },
          { "name": "Vagn Kristjánsson", "nationalId": "3110805719" },
          { "name": "Valdemar Þór Viðarsson", "nationalId": "0111724079" },
          { "name": "Valdimar Runólfsson", "nationalId": "0908625889" },
          { "name": "Valdimar Þorgeirsson", "nationalId": "2808543369" },
          { "name": "Valur Bergmundsson", "nationalId": "1607725149" },
          { "name": "Valur Örn Arnarson", "nationalId": "2907734669" },
          { "name": "Vilhjálmur Árnason", "nationalId": "2910834989" },
          { "name": "Vilhjálmur Gíslason", "nationalId": "2308594939" },
          { "name": "Viðar Einarsson", "nationalId": "2106422349" },
          {
            "name": "Þorkell Vilhelm Þorsteinsson",
            "nationalId": "1211562299"
          },
          {
            "name": "Þorsteinn Bjarki Pétursson",
            "nationalId": "2301963709"
          },
          { "name": "Þorsteinn Ó Alexandersson", "nationalId": "2305572099" },
          { "name": "Þorsteinn Sveinn Karlsson", "nationalId": "2105633699" },
          { "name": "Þorvaldur Finnbogason", "nationalId": "0211513009" },
          { "name": "Þorvaldur Guðmundsson", "nationalId": "1305502319" },
          { "name": "Þorvaldur S Benediktsson", "nationalId": "2809596269" },
          { "name": "Þórgunnur Þórðardóttir", "nationalId": "1810883709" },
          { "name": "Þór Arnarsson", "nationalId": "1801625189" },
          { "name": "Þórður Bogason", "nationalId": "0112595619" },
          { "name": "Þráinn Elíasson", "nationalId": "1606473459" },
          {
            "name": "Þrúðmar Sigurður Þrúðmarsson",
            "nationalId": "1412545109"
          },
          {
            "name": "Þuríður Berglind Ægisdóttir",
            "nationalId": "1908695209"
          },
          { "name": "Ævar Friðriksson", "nationalId": "0402487819" },
          { "name": "Ölver Thorstensen", "nationalId": "1502625269" },
          { "name": "Örn Kristján Arnarson", "nationalId": "2304675609" }
        ]
      },
      "userProfile": {
        "data": {
          "email": "obmagnusson@gmail.com",
          "emailVerified": true,
          "mobilePhoneNumber": "+354-6904570",
          "mobilePhoneNumberVerified": true
        },
        "date": "2022-10-11T10:56:18.668Z",
        "status": "success"
      },
      "qualityPhoto": {
        "data": { "hasQualityPhoto": true },
        "date": "2022-10-11T10:56:17.920Z",
        "status": "success"
      },
      "juristictions": {
        "data": [
          { "id": "12", "zip": 300, "name": "Akranes" },
          { "id": "13", "zip": 310, "name": "Borgarnes" },
          { "id": "14", "zip": 340, "name": "Stykkishólmur" },
          { "id": "15", "zip": 370, "name": "Búðardalur" },
          { "id": "16", "zip": 450, "name": "Patreksfjörður" },
          { "id": "18", "zip": 400, "name": "Ísafjörður" },
          { "id": "19", "zip": 510, "name": "Hólmavík" },
          { "id": "20", "zip": 540, "name": "Blönduós" },
          { "id": "21", "zip": 550, "name": "Sauðárkrókur" },
          { "id": "22", "zip": 580, "name": "Siglufjörður" },
          { "id": "24", "zip": 600, "name": "Akureyri" },
          { "id": "25", "zip": 641, "name": "Húsavík" },
          { "id": "26", "zip": 710, "name": "Seyðisfjörður" },
          { "id": "28", "zip": 735, "name": "Eskifjörður" },
          { "id": "29", "zip": 780, "name": "Höfn" },
          { "id": "30", "zip": 870, "name": "Vík" },
          { "id": "31", "zip": 860, "name": "Hvolsvöllur" },
          { "id": "32", "zip": 900, "name": "Vestmannaeyjar" },
          { "id": "33", "zip": 800, "name": "Selfoss" },
          { "id": "34", "zip": 230, "name": "Suðurnes" },
          { "id": "37", "zip": 201, "name": "Kópavogur" }
        ],
        "date": "2022-10-11T10:56:17.900Z",
        "status": "success"
      },
      "currentLicense": {
        "data": {
          "healthRemarks": [
            "Samrit ökuskírteinis nr. (auðkennisstafir ESB/SÞ fyrir þriðju lönd, t.d.„71.987654321.HR“)."
          ],
          "currentLicense": "B"
        },
        "date": "2022-10-11T10:56:18.659Z",
        "status": "success"
      },
      "nationalRegistry": {
        "data": {
          "age": 36,
          "address": {
            "city": "Sveitarfélagið Árborg",
            "code": "820054110050",
            "postalCode": "800",
            "lastUpdated": "18.12.2017 00:00:00",
            "streetAddress": "Starmói 5"
          },
          "fullName": "Ólafur Björn Magnússon",
          "nationalId": "2606862759",
          "citizenship": { "code": "IS", "name": "Ísland" },
          "legalResidence": "Starmói 5, 800 Sveitarfélagið Árborg"
        },
        "date": "2022-10-11T10:56:18.148Z",
        "status": "success"
      },
      "studentAssessment": {
        "data": null,
        "date": "2022-10-11T10:56:18.538Z",
        "status": "success"
      },
      "existingApplication": {
        "data": [],
        "date": "2022-10-11T10:56:17.565Z",
        "status": "success"
      }
    }
    `

    for (let i = 0; i < 3100; i++) {
      applications.push({
        id: randomUuid(),
        applicant: randomKennitala(),
        state: 'draft',
        attachments: JSON.stringify({}),
        created: randomPastDate(),
        modified: randomPastDate(),
        prune_at: randomPastdateLongAgo(),
        pruned: false,
        answers,
        external_data: externalData,
        ['type_id']: 'DrivingLicense',
      })
    }
    return queryInterface.bulkInsert('application', applications, {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('application', null, {})
  },
}
