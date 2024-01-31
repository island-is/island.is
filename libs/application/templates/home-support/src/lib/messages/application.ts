import { defineMessages } from 'react-intl'

export const application = {
  general: defineMessages({
    name: {
      id: 'hst.application:general.name',
      defaultMessage: 'Umsókn um heimastuðning',
      description: 'Home support application',
    },
    submit: {
      id: 'hst.application:general.submit',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application button text',
    },
  }),
  applicant: defineMessages({
    infoSectionTitle: {
      id: 'hst.applicant.information:section.title',
      defaultMessage: 'Upplýsingar um mig',
      description: 'Applicant information section title',
    },
    legalDomicilePersonsSectionTitle: {
      id: 'hst.applicant.legalDomicilePersons:section.title',
      defaultMessage: 'Skráðir á lögheimili',
      description: 'Legal domicile persons section title',
    },
    legalDomicilePersonsSectionSubtitle: {
      id: 'hst.applicant.legalDomicilePersons:section.subtitle',
      defaultMessage: 'Einstaklingar skráðir á lögheimili',
      description: 'Legal domicile persons section subtitle',
    },
    legalDomicilePersonsNotFoundTitle: {
      id: 'hst.applicant.legalDomicilePersons:notFound.title',
      defaultMessage: 'Ekkert sambúðarfólk',
      description: 'Legal domicile persons not found title',
    },
    legalDomicilePersonsNotFoundDescription: {
      id: 'hst.applicant.legalDomicilePersons:notFound.description',
      defaultMessage:
        'Engir aðrir einstaklingar eru skráðir á þínu heimilisfangi',
      description: 'Legal domicile persons not found description',
    },
  }),
  contacts: defineMessages({
    sectionTitle: {
      id: 'hst.contacts:section.title',
      defaultMessage: 'Tengiliðir',
      description: 'Contacts section title',
    },
    addContactButton: {
      id: 'hst.contacts:addContact.button',
      defaultMessage: 'Bæta við tengilið',
      description: 'Add contact button text',
    },
    saveContactButton: {
      id: 'hst.contacts:saveContact.button',
      defaultMessage: 'Vista tengilið',
      description: 'Save contact button text',
    },
    formTitle: {
      id: 'hst.contacts:form.title',
      defaultMessage: 'Nýr tengiliður',
      description: 'Contact form title',
    },
    relation: {
      id: 'hst.contacts:relation',
      defaultMessage: 'Tengsl',
      description: 'Relation label',
    },
  }),
  doctor: defineMessages({
    sectionTitle: {
      id: 'hst.doctor:section.title',
      defaultMessage: 'Heimilislæknir',
      description: 'Doctor section title',
    },
    receivesServiceTitle: {
      id: 'hst.doctor:service.title',
      defaultMessage: 'Færðu þjónustu nú þegar?',
      description: 'Receives service title',
    },
    doesReceiveServiceText: {
      id: 'hst.doctor:receives.service.yes',
      defaultMessage: 'Já, ég fæ ákveðna þjónustu hjá mínu sveitarfélagi',
      description: 'Does receive service text',
    },
    doesNotReceiveServiceText: {
      id: 'hst.doctor:receives.service.no',
      defaultMessage: 'Nei ég fæ ekki neina þjónustu',
      description: 'Does not receive service text',
    },
    notFoundText: {
      id: 'hst.doctor:notFound.text',
      defaultMessage: 'Enginn heimilislæknir skráður',
      description: 'Not found text',
    },
  }),
  reason: defineMessages({
    sectionTitle: {
      id: 'hst.reason:section.title',
      defaultMessage: 'Ástæða umsóknar',
      description: 'Reason section title',
    },
    sectionSubtitle: {
      id: 'hst.reason:section.subtitle',
      defaultMessage: 'Hvers vegna sækir þú um heimastuðning?',
      description: 'Reason section subtitle',
    },
    inputLabel: {
      id: 'hst.reason:input.label',
      defaultMessage: 'Athugasemd',
      description: 'Reason input label',
    },
    inputPlaceholder: {
      id: 'hst.reason:input.placeholder',
      defaultMessage: 'Skrifaðu hér ástæðu umsóknar',
      description: 'Reason input placeholder',
    },
  }),
  exemption: defineMessages({
    sectionTitle: {
      id: 'hst.exemption:section.title',
      defaultMessage: 'Undanþága',
      description: 'Exemption section title',
    },
    description: {
      id: 'hst.exemption:description#markdown',
      defaultMessage:
        'Ef þú ert með tekjur undir framfærsluviðmiði Tryggingastofnunar, sem er grunnlífeyrir TR, getur þú sótt um undanþágu frá gjaldskyldu hvað varðar aðstoð við þrif.\n\nHámarkstekjur fyrir undanþágu er **333.194** kr á mánuði fyrir einstaklinga og **657.194** kr fyrir hjón og sambýlisfólk. ',
      description: 'Exemption description',
    },
    checkboxText: {
      id: 'hst.exemption:checkbox.text',
      defaultMessage: 'Ég vil sækja um undanþágu',
      description: 'Exemption checkbox text',
    },
  }),
  overview: defineMessages({
    sectionTitle: {
      id: 'hst.overview:section.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview section title',
    },
    sectionDescription: {
      id: 'hst.overview:section.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Overview section description',
    },
    applicantTitle: {
      id: 'hst.overview:applicant.title',
      defaultMessage: 'Persónu upplýsingar',
      description: 'Overview applicant title',
    },
    receivesDoctorServiceTitle: {
      id: 'hst.overview:receivesDoctorService.title',
      defaultMessage: 'Færðu þjónustu frá þínu sveitarfélagi nú þegar?',
      description: 'Overview receives doctor service title',
    },
    exemptionTitle: {
      id: 'hst.overview:exemption.title',
      defaultMessage:
        'Er sótt um undanþágu á greiðslum fyrir þjónustu í formi þrifa?',
      description: 'Overview exemption title',
    },
  }),
  conclusion: defineMessages({
    alertTitle: {
      id: 'hst.conclusion:alert.title',
      defaultMessage:
        'Umsókn þín fyrir heimaþjónustu er móttekin og fer í vinnslu sem fyrst',
      description: 'Conclusion alert title',
    },
    expendableHeader: {
      id: 'hst.conclusion:expendable.header',
      defaultMessage: 'Hér eru næstu skref',
      description: 'Conclusion expendable header',
    },
    expendableContent: {
      id: 'hst.conclusion:expendable.content#markdown',
      defaultMessage: `* Staðfesting á móttöku umsóknar mun berast frá sveitarfélaginu þínu.\n\n* Starfsmaður sveitarfélagsins mun vera í sambandi við þig varðandi mat og útfærslu á þjónustu.
      `,
      description: 'Conclusion expendable content',
    },
  }),
}
