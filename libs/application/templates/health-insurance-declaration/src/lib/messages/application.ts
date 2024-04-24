import { defineMessages } from 'react-intl'

export const application = {
  general: defineMessages({
    name: {
      id: 'hid.application:general.name',
      defaultMessage: 'Tryggingaryfirlýsingarvottorð',
      description: 'Health insurance declaration name',
    },
  }),
  applicant: defineMessages({
    sectionTitle: {
      id: 'hid.application:applicant.section.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Applicant section title',
    },
  }),
  notHealthInusred: defineMessages({
    sectionTitle: {
      id: 'hid.application:notHealthInsured.section.title',
      defaultMessage: 'Ekki með sjúkratryggingu',
      description: 'Not Health Insured section title',
    },
    sectionDescription: {
      id: 'hid.application:notHealthInsured.section.description',
      defaultMessage: 'Því miður átt þú ekki rétt á tryggingaryfirlýsingu',
      description: 'Not Health Insured section description',
    },
    descriptionFieldDescription: {
      id: 'hid.application:notHealthInsured.section.descriptionField.description#markdown',
      defaultMessage: `Ástæðan fyrir því er eftirfarandi:

* Einstaklingur er ekki sjúkratryggð/ur á Íslandi.
* Ef þú telur þetta ekki eiga við, vinsamlega hafðu samband við [ehic@sjukra.is](mailto:ehic@sjukra.is)`,
      description: 'Not Health Insured section descriptionField description',
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
    travellerSectionDescription: {
      id: 'hid.application:residency.section.traveller.description',
      defaultMessage: 'Veldu staðsetningu',
      description: 'Traveller residency section description',
    },
    studentSectionDescription: {
      id: 'hid.application:residency.section.student.description',
      defaultMessage: 'Veldu land úr lista þar sem nám verður stundað',
      description: 'Student residency section description',
    },
    studentSectionPlaceholderText: {
      id: 'hid.application:residency.section.student.placeholderSelectText',
      defaultMessage: 'Veldur land sem þú ferðast til',
      description: 'Student residency selection placeholder text',
    },
  }),
  educationConfirmation: defineMessages({
    sectionTitle: {
      id: 'hid.application:educationConfirmation.section.title',
      defaultMessage: 'Staðfesting á námi',
      description: 'Education confirmation section title',
    },
    SectionDescription: {
      id: 'hid.application:educationConfirmation.section.description',
      defaultMessage:
        'Bættu við staðfestingu á námi frá viðurkenndri námsstofnun eða lánastofnun Íslenskra námsmanna',
      description: 'Education conformation section description',
    },
    UploadFieldTitle: {
      id: 'hid.application:educationConfirmation.uploadField.title',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Education conformation upload field title',
    },
    UploadFieldDescription: {
      id: 'hid.application:educationConfirmation.uploadField.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
      description: 'Education conformation upload field description',
    },
    UploadFieldButtonText: {
      id: 'hid.application:educationConfirmation.uploadField.buttonText',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Education conformation upload field button text',
    },
  }),
  date: defineMessages({
    sectionTitle: {
      id: 'hid.application:date.section.title',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Date section title',
    },
    sectionDescription: {
      id: 'hid.application:date.section.description',
      defaultMessage: 'Veldu dagsetningu dvalar',
      description: 'Date section description',
    },
    dateFromTitle: {
      id: 'hid.application:date.section.dateFrom.title',
      defaultMessage: 'Dagsetning frá',
      description: 'Date field from title',
    },
    dateToTitle: {
      id: 'hid.application:date.section.dateFrom.title',
      defaultMessage: 'Dagsetning til',
      description: 'Date field to title',
    },
    datePlaceholderText: {
      id: 'hid.application:date.section.datefield.placeholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Date field placeholder text',
    },
  }),
  overview: defineMessages({
    sectionTitle: {
      id: 'hid.application:overview.section.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Overview section title',
    },
    sectionDescription: {
      id: 'hid.application:overview.section.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Overview section description',
    },
    studentOrTravellerTitle: {
      id: 'hid.application:overview.section.studentOrTravellerTitle',
      defaultMessage: 'Ertu ferðamaður eða námsmaður',
      description: 'Overview section Student or Traveller title',
    },
    studentOrTravellerTravellerText: {
      id: 'hid.application:overview.section.studentOrTravellerTravellerText',
      defaultMessage: 'Ferðamaður',
      description: 'Overview section Student or Traveller: Traveller text',
    },
    studentOrTravellerStudentText: {
      id: 'hid.application:overview.section.studentOrTravellerStudentText',
      defaultMessage: 'Námsmaður',
      description: 'Overview section Student or Traveller: Student text',
    },
    applicantInfoTitle: {
      id: 'hid.application:overview.section.applicantTitle',
      defaultMessage: 'Persónu upplýsingar',
      description: 'Overview section applicant title',
    },
    familyTableTitle: {
      id: 'hid.application:overview.section.familyTableHeader',
      defaultMessage: 'Maki og börn',
      description: 'Overview section family table title',
    },
    familyTableRelationHeader: {
      id: 'hid.application:overview.section.familyTableHeaderRelationText',
      defaultMessage: 'Tengsl',
      description: 'Overview section family table title',
    },
    familyTableRelationSpuoseText: {
      id: 'hid.application:overview.section.familyTableSpouseRelationText',
      defaultMessage: 'Maki',
      description: 'Overview section family table spouse relation text',
    },
    familyTableRelationChildText: {
      id: 'hid.application:overview.section.familyTableChildRelationText',
      defaultMessage: 'Barn',
      description: 'Overview section family table child relation text',
    },
    dateTitle: {
      id: 'hid.application:overview.section.DateTitle',
      defaultMessage: 'Dvalartímabil',
      description: 'Overview section date period',
    },
    fileUploadListTitle: {
      id: 'hid.application:overview.section.fileUploadTitle',
      defaultMessage: 'Fylgiskjöl',
      description: 'File upload list title',
    },
    submitButtonText: {
      id: 'hid.application:overview.section.submitButtonText',
      defaultMessage: 'Halda áfram',
      description: 'Submit button text',
    },
  }),
}
