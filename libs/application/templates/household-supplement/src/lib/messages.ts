import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const householdSupplementFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'hs.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'hs.application:application.title',
      defaultMessage: 'Umsókn um heimilisuppbót',
      description: 'Application for household supplement',
    },
    formTitle: {
      id: 'hs.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'hs.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'hs.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    householdSupplement: {
      id: 'hs.application:household.supplement',
      defaultMessage: 'Heimilisuppbót',
      description: 'Household supplement',
    },
  }),

  pre: defineMessages({
    prerequisitesSection: {
      id: 'hs.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataSection: {
      id: 'hs.application:external.data.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    checkboxProvider: {
      id: 'hs.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    userProfileInformationTitle: {
      id: 'hs.application:userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum Ísland.is',
      description: 'Information from your account on Ísland.is',
    },
    userProfileInformationSubTitle: {
      id: 'hs.application:userprofile.subtitle',
      defaultMessage:
        'Sækir upplýsingar um netfang, símanúmer og bankareikning frá mínum síðum Ísland.is.',
      description:
        'Information about email adress, phone number and bank account will be retrieved from your account at Ísland.is.',
    },
    skraInformationTitle: {
      id: 'hs.application:skra.info.title',
      defaultMessage: 'Upplýsingar frá þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    skraInformationSubTitle: {
      id: 'hs.application:skra.info.subtitle',
      defaultMessage: 'Sækir upplýsingar um þig, maka og börn frá Þjóðskrá.',
      description:
        'Information about you, spouse and children will be retrieved from Registers Iceland.',
    },
    startApplication: {
      id: 'hs.application.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'hs.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    subSectionTitle: {
      id: 'hs.application:info.sub.section.title',
      defaultMessage: 'Netfang og símanúmer',
      description: 'Email and phone number',
    },
    subSectionDescription: {
      id: 'hs.application:info.sub.section.description',
      defaultMessage:
        'Netfang og símanúmer er sótt á mínar síður á Ísland.is. Ef upplýsingarnar eru ekki réttar eða vantar setur þú þær inn hér.',
      description: 'translation',
    },
    applicantEmail: {
      id: 'hs.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'hs.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    paymentTitle: {
      id: 'hs.application:info.payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    paymentAlertTitle: {
      id: 'hs.application:info.payment.alert.title',
      defaultMessage: 'Til athugunar!',
      description: 'For consideration',
    },
    paymentAlertMessage: {
      id: 'hs.application:info.payment.alert.message',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inná bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inná þann reiking.',
      description:
        'All your payments from TR are paid into the bank account below. If you change your bank details, all your payments from the TR will be paid into that account.',
    },
    paymentBank: {
      id: 'hs.application:info.payment.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    householdSupplementDescription: {
      id: 'hs.application:info.household.supplement.description',
      defaultMessage:
        'Til að eiga rétt á heimilisuppbót verður umsækjandi að vera einhleypur og búa einn. Einnig er heimilt að greiða heimilisuppbót til lífeyrisþega ef maki dvelur á stofnun fyrir aldraða. Tvær undantekningar eru á þessu: býr með barni/börnum yngri en 18 ára eða 18-25 ára ungmenni/um  sem er í námi eða ef ungmenni yngra en 25 ára er með tímabundið aðsetur fjarri lögheimili vegna náms.',
      description: 'english translation',
    },
    householdSupplementHousing: {
      id: 'hs.application:info.household.supplement.housing',
      defaultMessage: 'Hvar býrð þú?',
      description: 'Where do you live?',
    },
    householdSupplementHousingOwner: {
      id: 'hs.application:info.household.supplement.housing.owner',
      defaultMessage: 'í eigin húsnæði',
      description: 'english translation',
    },
    householdSupplementHousingRenter: {
      id: 'hs.application:info.household.supplement.housing.renter',
      defaultMessage: 'í leiguhúsnæði',
      description: 'in a rented place',
    },
    householdSupplementChildrenBetween18And25: {
      id: 'hs.application:info.household.supplement.children.betweem18And25',
      defaultMessage:
        'Býr ungmenni á aldrinum 18-25 ára á heimilinu sem er í námi?',
      description: 'english translation',
    },
    householdSupplementAlertTitle: {
      id: 'hs.application:info.household.supplement.alert.title',
      defaultMessage: 'Athuga',
      description: 'Attention',
    },
    householdSupplementAlertDescription: {
      id: 'hs.application:info.household.supplement.alert.description',
      defaultMessage:
        'Samkvæmt uppflettingu í Þjóðskrá býr einstaklingur eldri en 25 ára á sama lögheimili og þú. Ef þú telur þetta vera vitlaust skaltu hafa samband við Þjóðskrá til að laga þetta. Þegar þú ert búinn að gera viðeigandi breytingar hjá Þjóðskrá getur þú haldið áfram með umsóknina og skila inn skjali því til staðfestingar hér aftar í ferlinu.',
      description: 'english translation',
    },
    periodTitle: {
      id: 'hs.application:info.period.title',
      defaultMessage: 'Tímabil',
      description: `Period`,
    },
    periodDescription: {
      id: 'hs.application:info.period.description',
      defaultMessage:
        'Veldu tímabil sem þú vilt byrja að fá greidda heimilisuppbót. Hægt er að sækja fyrir árið í ár og 2 ár aftur í tímann.',
      description: `english translation`,
    },
    periodYear: {
      id: 'hs.application:info.period.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    periodYearDefaultText: {
      id: 'hs.application:info.period.year.default.text',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    periodMonth: {
      id: 'hs.application:info.period.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    periodMonthDefaultText: {
      id: 'hs.application:info.period.month.default.text',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'hs.application:additional.info.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional information',
    },
  }),

  confirm: defineMessages({
    section: {
      id: 'hs.application:confirm.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirm',
    },
    title: {
      id: 'hs.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    description: {
      id: 'hs.application:confirmation.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
  }),

  conclusion: defineMessages({
    title: {
      id: 'hs.application:conclusion.title',
      defaultMessage: 'Umsókn móttekin og bíður tekjuáætlunar',
      description: 'Congratulations, below are the next steps',
    },
  }),

  months: defineMessages({
    january: {
      id: 'hs.application:month.january',
      defaultMessage: 'Janúar',
      description: 'January',
    },
    february: {
      id: 'hs.application:month.february',
      defaultMessage: 'Febrúar',
      description: 'February',
    },
    march: {
      id: 'hs.application:month.march',
      defaultMessage: 'Mars',
      description: 'March',
    },
    april: {
      id: 'hs.application:month.april',
      defaultMessage: 'Apríl',
      description: 'April',
    },
    may: {
      id: 'hs.application:month.may',
      defaultMessage: 'Maí',
      description: 'May',
    },
    june: {
      id: 'hs.application:month.june',
      defaultMessage: 'Júní',
      description: 'June',
    },
    july: {
      id: 'hs.application:month.july',
      defaultMessage: 'Júlí',
      description: 'July',
    },
    august: {
      id: 'hs.application:month.august',
      defaultMessage: 'Ágúst',
      description: 'August',
    },
    september: {
      id: 'hs.application:month.september',
      defaultMessage: 'September',
      description: 'September',
    },
    october: {
      id: 'hs.application:month.october',
      defaultMessage: 'Október',
      description: 'October',
    },
    november: {
      id: 'hs.application:month.november',
      defaultMessage: 'Nóvember',
      description: 'November',
    },
    desember: {
      id: 'hs.application:month.desember',
      defaultMessage: 'Desember',
      description: 'December',
    },
  }),

  errors: defineMessages({
    phoneNumber: {
      id: 'hs.application:error.phonenumber',
      defaultMessage: 'Símanúmerið þarf að vera gilt.',
      description: 'The phone number must be valid.',
    },
  }),
}
