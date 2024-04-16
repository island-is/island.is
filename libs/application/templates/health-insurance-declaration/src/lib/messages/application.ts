import { defineMessages } from 'react-intl'

export const application = {
  general: defineMessages({
    name: {
      id: 'hid.application:general.name',
      defaultMessage: 'Tryggingaryfirlýsingarvottorð',
      description: 'Health insurance declaration name',
    },
  }),
  studentOrTraveller: defineMessages({
    sectionTitle: {
      id: 'hid.application:studentOrTraveller.section.title',
      defaultMessage: 'Námsmaður/ferðamaður',
      description: 'Student or Traveller section title',
    },
    sectionDescription: {
      id: 'hid.application:studentOrTraveller.section.description',
      defaultMessage: 'Ertu ferðamaður eða námsmaður?',
      description: 'Student or Traveller section description',
    },
    travellerRadioFieldText: {
      id: 'hid.application:studentOrTraveller.section.traveller.radio.text',
      defaultMessage: 'Frí, vinna og námskeið',
      description: 'Traveller radio field text',
    },
    studentRadioFieldText: {
      id: 'hid.application:studentOrTraveller.section.traveller.radio.text',
      defaultMessage: 'Námsmaður',
      description: 'Student radio field text',
    },
    studentOrTravellerAlertMessageText: {
      id: 'hid.application:studentOrTraveller.section.traveller.alert.text#markdown',
      defaultMessage: `Trygginaryfirlýsing gildir í þeim löndum þar sem Evrópska sjúkratryggingarkortið (ES kortið)
      gildir ekki, Ef ferðinni er heitið til landa innan EES landa eða Sviss skal sækja um ES kortið.
      Athugið að ríkisborgarar utan EES eiga ekki rétt á ES korti og sækja því ávalt um tryggingaryfirlýsingu vegna 
      ferða bæði innan og utan EES, sjá nánar hér. Fyrir frekari upplýsingar er hægt að senda tölvupóst á netfangið 
      es.kort@sjukra.is eða hringja í síma 515-0000`,
      description: 'Student radio field text',
    },
  }),
  registerPersons: defineMessages({
    sectionTitle: {
      id: 'hid.application:registerPersons.section.title',
      defaultMessage: 'Skrá einstaklinga',
      description: 'Register persons section title',
    },
    sectionDescription: {
      id: 'hid.application:registerPersons.section.description',
      defaultMessage: 'Ég er einnig að sækja um fyrir',
      description: 'Register persons section description',
    },
    spousetitle: {
      id: 'hid.application:registerPersons.section.spouseTitle',
      defaultMessage: 'Maki',
      description: 'Register persons spouse title',
    },
    childrenTitle: {
      id: 'hid.application:registerPersons.section.childrenTitle',
      defaultMessage: 'Börn',
      description: 'Register persons children title',
    },
  }),
  residency: defineMessages({
    sectionTitle: {
      id: 'hid.application:residency.section.title',
      defaultMessage: 'Veldu dvalarstað',
      description: 'Residency section title',
    },
    sectionDescription: {
      id: 'hid.application:residency.section.description',
      defaultMessage: 'Veldu staðsetningu',
      description: 'Residency section description',
    },
  }),
  date: defineMessages({
    sectionTitle: {
      id: 'hid.application:dat.section.title',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Date section title',
    },
    sectionDescription: {
      id: 'hid.application:dat.section.description',
      defaultMessage: 'Veldu dagsetningu dvalar',
      description: 'Date section description',
    },
    dateFromTitle: {
      id: 'hid.application:dat.section.dateFrom.title',
      defaultMessage: 'Dagsetning frá',
      description: 'Date field from title',
    },
    dateToTitle: {
      id: 'hid.application:dat.section.dateFrom.title',
      defaultMessage: 'Dagsetning til',
      description: 'Date field to title',
    },
    datePlaceholderText: {
      id: 'hid.application:dat.section.datefield.placeholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Date field placeholder text',
    },
  }),
}
