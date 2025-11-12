import { defineMessages } from 'react-intl'

export const externalData = {
  agreementDescription: defineMessages({
    sectionTitle: {
      id: 'an.application:section.agreementDescription.sectionTitle',
      defaultMessage: 'Miðlun upplýsinga',
      description: 'Information on data handling',
    },
    listTitle: {
      id: 'an.application:section.agreementDescription.listTitle',
      defaultMessage: 'Meðferð á gögnum',
      description: 'Data handling list item title',
    },
    bulletOne: {
      id: 'an.application:section.agreementDescription.BulletOne',
      defaultMessage:
        'Þegar tilkynning um slys er send Sjúkratryggingum Íslands mun stofnunin miðla upplýsingum um afstöðu til bótaskyldu með þeim atvinnurekanda eða íþróttafélagi sem á í hlut. Ástæða þess er að umræddir aðilar kunna að eiga rétt á endurgreiðslu útlagðs kostnaðar og/eða dagpeningum ef greidd hafa verið laun í veikindaforföllum vegna slyssins. Þessir aðilar fá aldrei afhentar heilsufars- eða sjúkraskrárupplýsingar.',
      description: 'List item 1 on data gathering information',
    },
    bulletTwo: {
      id: 'an.application:section.agreementDescription.BulletTwo',
      defaultMessage:
        'Vinnueftirlit ríkisins kann einnig að fá afrit af tilkynningunni undir ákveðnum kringumstæðum á grundvelli 4. mgr. 79. gr. laga nr. 46/1980 sem og Rannsóknarnefnd samgönguslysa á grundvelli 12. og 16. gr. laga nr. 18/2013.',
      description: 'List item 2 on data gathering information',
    },
    bulletThree: {
      id: 'an.application:section.agreementDescription.BulletThree',
      defaultMessage:
        'Eitthvað óvænt verður að hafa gerst sem veldur tjóni á líkama hins tryggða og áhorfandi getur áttað sig á að hafi gerst.',
      description: 'List item 3 on data gathering information',
    },
    bulletFour: {
      id: 'an.application:section.agreementDescription.BulletFour',
      defaultMessage:
        'Ef tilkynningaskylda er vanrækt skal það ekki vera því til fyrirstöðu að sá slasaði eða vandamenn geti gert kröfu til bóta.  Heimilt er að veita undanþágu þótt meira en ár sé liðið ef atvik slyss eru alveg ljós og drátturinn torveldar ekki gagnaöflun um atriði sem skipta máli. Þá er það skilyrði að unnt sé að meta orsakasamband slyssins og heilsutjóns slasaða.',
      description: 'List item 4 on data gathering information',
    },
    bullets: {
      id: 'an.application:section.agreementDescription.bullets#markdown',
      defaultMessage:
        '* Þegar tilkynning um slys er send Sjúkratryggingum Íslands mun stofnunin miðla upplýsingum um afstöðu til bótaskyldu með þeim atvinnurekanda eða íþróttafélagi sem á í hlut. Ástæða þess er að umræddir aðilar kunna að eiga rétt á endurgreiðslu útlagðs kostnaðar og/eða dagpeningum ef greidd hafa verið laun í veikindaforföllum vegna slyssins. Þessir aðilar fá aldrei afhentar heilsufars- eða sjúkraskrárupplýsingar. \n\n* Vinnueftirlit ríkisins kann einnig að fá afrit af tilkynningunni undir ákveðnum kringumstæðum á grundvelli 4. mgr. 79. gr. laga nr. 46/1980 sem og Rannsóknarnefnd samgönguslysa á grundvelli 12. og 16. gr. laga nr. 18/2013. \n\n* Eitthvað óvænt verður að hafa gerst sem veldur tjóni á líkama hins tryggða og áhorfandi getur áttað sig á að hafi gerst.',
      description: 'Information on data handling before prerequisites',
    },
    moreInformation: {
      id: 'an.application:section.agreementDescription.moreInformation#markdown',
      defaultMessage:
        'Nánari upplýsingar um vinnslu persónuupplýsinga hjá Sjúkratryggingum Íslands á [Persónuverndarsíðu Sjúkratrygginga](https://www.sjukra.is/personuvernd)',
      description: 'More information about data handling',
    },
  }),
  dataProvider: defineMessages({
    sectionTitle: {
      id: 'an.application:section.dataProvider.sectionTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval section title',
    },
    pageTitle: {
      id: 'an.application:section.dataProvider.pageTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'External information retrieval page title',
    },
    subTitle: {
      id: 'an.application:section.dataProvider.subTitle',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt.',
      description: 'External information retrieval subtitle',
    },
    checkboxLabel: {
      id: 'an.application:section.dataProvider.checkboxLabel',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað við úrvinnslu tilkynningarinnar',
      description: 'External information retrieval checkbox label',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'an.application:section.externalData.nationalRegistry.title',
      defaultMessage: 'Þjóðskrá Íslands:',
      description: 'Title: National Registry',
    },
    description: {
      id: 'an.application:section.externalData.nationalRegistry.description',
      defaultMessage:
        'Upplýsingar um nafn, kennitölu og heimilisfang. Upplýsingar um börn og maka.',
      description: 'Description: National Registry',
    },
    procureDescription: {
      id: 'an.application:section.externalData.nationalRegistry.procureDescription',
      defaultMessage: 'Upplýsingar um nafn, kennitölu og heimilisfang.',
      description: 'Description: National Registry for procure holder',
    },
    subTitle: {
      id: 'an.application:section.externalData.nationalRegistry.subTitle',
      defaultMessage: 'Hér sækjum við nafn, kennitölu og heimilisfang',
      description: 'We will fetch name, national id and address',
    },
  }),
  accidentProvider: defineMessages({
    title: {
      id: 'an.application:section.externalData.accidentProvider.title',
      defaultMessage: 'Upplýsingar sóttar af Sjúkratryggingum Íslands',
      description: 'Title: Accident Provider',
    },
    description: {
      id: 'an.application:section.externalData.accidentProvider.description',
      defaultMessage:
        'Í einstaka tilvikum getur verið nauðsynlegt að afla upplýsinga frá atvinnurekanda eða eftir atvikum íþróttafélaga um slysið ef þær fást ekki frá slasaða.',
      description: 'Description: Accident Provider',
    },
  }),
  revAndCustoms: defineMessages({
    title: {
      id: 'an.application:section.externalData.revAndCustoms.title',
      defaultMessage: 'Skattinum:',
      description: 'Title: External Info about applicants insurance ',
    },
    description: {
      id: 'an.application:section.externalData.revAndCustoms.description',
      defaultMessage:
        'Upplýsingar um launagreiðslur/reiknað endurgjald. Nafn og kennitölu launagreiðanda. Upplýsingar um hvort heimilistrygging sé í gildi.',
      description: 'Description: External Info about applicants insurance',
    },
  }),
  notifications: defineMessages({
    title: {
      id: 'an.application:section.externalData.notifications.title',
      defaultMessage: 'Samþykki fyrir tilkynningar',
      description: 'Approval of notifications',
    },
    description: {
      id: 'an.application:section.externalData.notifications.description',
      defaultMessage: 'Send verða til þín skilaboð um stöðu mála o.s.frv.',
      description:
        'Notifications will be sent regarding the status of your application',
    },
  }),
  directoryOfLabor: defineMessages({
    title: {
      id: 'an.application:section.externalData.directoryOfLabor.title',
      defaultMessage: 'Vinnumálastofnun:',
      description: 'Approval of directory of labor',
    },
    description: {
      id: 'an.application:section.externalData.directoryOfLabor.description',
      defaultMessage:
        'Upplýsingar um tímabil atvinnuleysisbóta og greiðslna úr fæðingarorlofssjóði.',
      description: 'Approval of gathering information from directory of labor',
    },
  }),

  nationalInsurancy: defineMessages({
    title: {
      id: 'an.application:section.externalData.nationalInsurancy.title',
      defaultMessage: 'Tryggingastofnun ríkisins:',
      description: 'Approval of National insurancy',
    },
    description: {
      id: 'an.application:section.externalData.nationalInsurancy.description',
      defaultMessage:
        'Upplýsingar um örorku- eða endurhæfingarmat (stöðu). Upplýsingar um greiðslur sem ekki má greiða samhliða bótum slysatrygginga (stöðu).',
      description: 'Approval of gathering information from National insurancy',
    },
  }),
  municipalCollectionAgency: defineMessages({
    title: {
      id: 'an.application:section.externalData.municipalCollectionAgency.title',
      defaultMessage: 'Innheimtustofnun sveitarfélaga:',
      description: 'Approval of Municipal Collection Agency',
    },
    description: {
      id: 'an.application:section.externalData.municipalCollectionAgency.description',
      defaultMessage: 'Upplýsingar um stöðu meðlagsgreiðslna.',
      description:
        'Approval of gathering information from Approval of Municipal Collection Agency',
    },
  }),
}
