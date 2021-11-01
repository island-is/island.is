import { defineMessages } from 'react-intl'

export const externalData = {
  agreementDescription: defineMessages({
    sectionTitle: {
      id: 'an.application:section.agreementDescription.sectionTitle',
      defaultMessage: 'Upplýsingar um meðferð á gögnum',
      description: 'Information on data handling',
    },
    bulletOne: {
      id: 'an.application:section.agreementDescription.BulletOne',
      defaultMessage:
        'Vinnueftirlit ríkisins fær afrit þessa eyðublaðs á grundvelli 4. mgr. 79. gr. laga nr. 46/1980. Tryggingastofnun ríkisins fær upplýsingar um bótagreiðslur sem ekki greiðast samhliða bótum stofnunarinnar, sbr. 14. gr. laga nr. 45/2015.',
      description: 'List item 1 on data gathering information',
    },
    bulletTwo: {
      id: 'an.application:section.agreementDescription.BulletTwo',
      defaultMessage:
        'Þannig verður eitthvað óvænt að hafa átt sér stað og skilyrði er að óhappið verði ekki rakið til undirliggjandi sjúkdóms eða meinsemda hjá þeim sem fyrir óhappi verður.',
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
      defaultMessage: 'Upplýsingar frá þjóðskrá',
      description: 'Title: National Registry',
    },
    description: {
      id: 'an.application:section.externalData.nationalRegistry.description',
      defaultMessage: 'Nafn, kennitala, símanúmer, netfang',
      description: 'Description: National Registry',
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
        'Við vinnslu málsins munu Sjúkratryggingar Íslands afla nauðsynlegra upplýsinga frá skattyfirvöldum, Tryggingastofnun ríkisins, Vinnumálastofnun, Þjóðskrá Íslands og evrópskum sjúkratryggingastofnunum, þegar það á við.',
      description: 'Description: Accident Provider',
    },
  }),
  revAndCustoms: defineMessages({
    title: {
      id: 'an.application:section.externalData.revAndCustoms.title',
      defaultMessage: 'Upplýsingar frá skattinum',
      description: 'Title: External Info about applicants insurance ',
    },
    description: {
      id: 'an.application:section.externalData.revAndCustoms.description',
      defaultMessage: 'Upplýsingar um slysatryggingu við heimilisstörf',
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
}
