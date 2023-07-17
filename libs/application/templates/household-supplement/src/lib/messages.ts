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

  fileUpload: defineMessages({
    attachmentButton: {
      id: 'hs.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'hs.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'hs.application:fileUpload.attachment.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description: 'Accepted documents with the following extensions: .pdf',
    },
    attachmentMaxSizeError: {
      id: 'hs.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    additionalFileTitle: {
      id: 'hs.application:fileUpload.additionalFile.title',
      defaultMessage: 'Fylgiskjöl viðbótagögn',
      description: 'Additional attachments',
    },
    additionalFileDescription: {
      id: 'hs.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis staðfestingu frá Þjóðskrá vegna rangar upplýsingar. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit additional data to TR. For example, confirmation from the National Registry due to incorrect information. Note that the document must be in .pdf format.',
    },
    leaseAgreementTitle: {
      id: 'hs.application:fileUppload.lease.agreement.title',
      defaultMessage: 'Fylgiskjöl leigusamningur',
      description: 'Household supplement rental agreement',
    },
    schoolConfirmationTitle: {
      id: 'hs.application:fileUppload.school.confirmation.title',
      defaultMessage: 'Fylgiskjöl skólavottorð',
      description: "Household supplement young person's school attendance",
    },
    leaseAgreement: {
      id: 'hs.application:fileUppload.lease.agreement',
      defaultMessage:
        'Hér getur þú skilað undirritaðum leigusamningi. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can upload the signed rental agreement. Note that the document must be in .pdf format.',
    },
    schoolConfirmation: {
      id: 'hs.application:fileUppload.school.confirmation',
      defaultMessage:
        'Hér getur þú skilað vottorði um skólavist ungmennis. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        "Here you can upload a certificate of a young person's school attendance. Note that the document must be in .pdf format.",
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
    leaseAgreementAttachment: {
      id: 'hs.application:confirm.lease.agreement.attachment',
      defaultMessage: 'Undirritaður leigusamningur',
      description: 'Signed lease agreement',
    },
    schoolConfirmationAttachment: {
      id: 'hs.application:confirm.school.confirmation.attachment',
      defaultMessage: 'Vottorð um skólavist ungmennis',
      description: 'Certificate of school attendance of a young person',
    },
    additionalDocumentsAttachment: {
      id: 'hs.application:confirm.additional.documents.attachment',
      defaultMessage: 'Viðbótargögn til Tryggingastofnunar',
      description: 'Additional documents to Tryggingastofnunar',
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

export const validatorErrorMessages = defineMessages({
  requireAnswer: {
    id: 'oap.application:fileUpload.required.answer',
    defaultMessage: 'Ógilt gildi',
    description: 'Invalid value',
  },
  periodStartDateNeeded: {
    id: 'oap.application:period.startDate.Needed',
    defaultMessage: 'Finn ekki byrjunardagsetning.',
    description: 'Could not calculate startDate.',
  },
  periodEndDateNeeded: {
    id: 'oap.application:period.endDate.Needed',
    defaultMessage: 'Finn ekki endadagsetning.',
    description: 'Could not calculate endDate.',
  },
  periodYear: {
    id: 'oap.application:period.year',
    defaultMessage: 'Vitlaust ár.',
    description: 'Invalid year.',
  },
  periodMonth: {
    id: 'oap.application:period.month',
    defaultMessage: 'Vitlaus mánuður.',
    description: 'Invalid month.',
  },
  requireAttachment: {
    id: 'oap.application:fileUpload.required.attachment',
    defaultMessage: 'Þú þarft að hlaða upp viðhenginu til að halda áfram.',
    description: 'Error message when the attachment file is not provided.',
  },
  employerEmailMissing: {
    id: 'oap.application:employer.email.missing',
    defaultMessage: 'Netfang atvinnurekanda vantar',
    description: 'Employer email missing',
  },
  employerEmailDuplicate: {
    id: 'oap.application:employer.email.duplicate',
    defaultMessage: 'Netfang atvinnurekanda er þegar skráð',
    description: 'Employer email is already added',
  },
  employerRatioTypeMissing: {
    id: 'oap.application:employer.ratioType.missing',
    defaultMessage: 'Vinsamlegast veldu starfhlutfall',
    description: 'Copy when ratioType is missing',
  },
  employersNotAList: {
    id: 'oap.application:employers.employersNotAList',
    defaultMessage: 'Svar þarf að vera listi af atvinnurekanda',
    description: 'Copy when employers is not a list',
  },
  employersRatioMoreThan50: {
    id: 'oap.application:employers.ratio.more.than.50',
    defaultMessage: 'Starfhlutfall má ekki vera meira en 50%',
    description: 'Employment rate must be less than or equal 50%',
  },
  employersRatioLessThan0: {
    id: 'oap.application:employers.ratio.less.than.0',
    defaultMessage: 'Starfhlutfall má ekki vera minni en 1%',
    description: 'Employment rate must be more than 0%',
  },
  employerRatioMissing: {
    id: 'oap.application:employer.ratio.missing',
    defaultMessage: 'Starfhlutfall vantar',
    description: 'Employer rate missing',
  },
  employersPhoneNumberInvalid: {
    id: 'oap.application:employer.phoneNumber.invalid',
    defaultMessage: 'Símanúmer verður að vera GSM númer',
    description: 'Phone number must be a GSM number',
  },
  personalAllowance: {
    id: 'oap.application:payment.personal.allowance',
    defaultMessage: 'Persónuafsláttur verður að vera milli 1 og 100',
    description: 'Personal allowace has to be between 1 and 100',
  },
})
