import { defineMessages } from "react-intl";

export const prerequisiteMessages = defineMessages({
  title: {
    id: 'dp.application:prerequisites.title',
    defaultMessage: 'Forsendur',
    description: 'Prerequisites',
  },
  checkboxLabel: {
    id: 'dp.application:prerequisites.checkboxLabel',
    defaultMessage:
      'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
    description: 'Checkbox label for sharing data',
  },
  organizationDataTitle: {
    id: 'dp.application:prerequisites.organizationDataTitle',
    defaultMessage: 'Upplýsingar frá stofnunum',
    description: 'Organization data title',
  },
  organizationDataText: {
    id: 'dp.application:prerequisites.organizationDataText',
    defaultMessage:
      'Upplýsingar um þig, maka og börn frá Þjóðskrá, RSK, Útlendingastofnun, Vinnumálastofnun og Sjúkratryggingum Íslands.',
    description: 'Organization data text',
  },
  myPagesTitle: {
    id: 'dp.application:prerequisites.myPagesTitle',
    defaultMessage: 'Upplýsingar af mínum síðum Ísland.is',
    description: 'My pages title',
  },
  myPagesText: {
    id: 'dp.application:prerequisites.myPagesText',
    defaultMessage: 'Upplýsingar um símanúmer og netfang.',
    description: 'My pages text',
  },
  healthDataTitle: {
    id: 'dp.application:prerequisites.healthDataTitle',
    defaultMessage: 'Upplýsingar frá heilbrigðisstofnun',
    description: 'Health data title',
  },
  healthDataText: {
    id: 'dp.application:prerequisites.healthDataText',
    defaultMessage: 'Upplýsingar um læknisvottorð vegna örorku.',
    description: 'Health data text',
  },
  rehabilitationTitle: {
    id: 'dp.application:prerequisites.rehabilitationTitle',
    defaultMessage:
      'Upplýsingar frá þjónustuaðila, endurhæfingar- eða meðferðaraðila',
    description: 'Rehabilitation information title',
  },
  rehabilitationText: {
    id: 'dp.application:prerequisites.rehabilitationText#markdown',
    defaultMessage:
      'Tryggingastofnun sækir þjónustulokaskýrslu og færnimat til þjónustuaðila sem sér um __endurhæfingu eða meðferð__.',
    description: 'Rehabilitation information text',
  },
  incomeTitle: {
    id: 'dp.application:prerequisites.incomeTitle',
    defaultMessage: 'Upplýsingar um tekjur og aðstæður',
    description: 'Income information title',
  },
  incomeText: {
    id: 'dp.application:prerequisites.incomeText#markdown',
    defaultMessage:
      'Í sumum tilfellum þarf Tryggingastofnun að sækja tekjuupplýsingar til Innheimtustofnunar sveitarfélaga, lífeyrissjóða, stéttarfélaga og RSK til að ákvarða réttindi.',
    description: 'Income information text',
  },
  dataFetchTitle: {
    id: 'dp.application:prerequisites.dataFetchTitle',
    defaultMessage: 'Gagnaöflun og meðferð persónuupplýsinga',
    description: 'Data fetch title',
  },
  dataFetchText: {
    id: 'dp.application:prerequisites.dataFetchText#markdown',
    defaultMessage:
      'Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna [hér.](https://www.tr.is/tryggingastofnun/personuvernd)\n\nEf tekjur eða aðrar aðstæður þínar breytast verður þú að láta Tryggingastofnun vita þar sem það getur haft áhrif á greiðslur þínar.\n\nRangar eða ófullnægjandi upplýsingar geta haft áhrif á afgreiðslu umsóknarinnar og hugsanlega leitt til endurkröfu eða annara viðurlaga.\n\nEf umsókn kemur frá erlendri stofnun  getur Tryggingastofnun óskað eftir frekari gögnum frá þeirri stofnunn.\n\nAuk þess getur tryggingastofnun haft samband við erlendar stofnanir ef þú telur þig eiga réttindi í öðru EES- landi, Bandaríkjunum eða Kanada, vegna réttinda þinna þar fyrir þína hönd.',
    description: 'Data fetch text',
  },
})
