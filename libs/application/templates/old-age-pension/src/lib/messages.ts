import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const oldAgePensionFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'oap.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'oap.application:applicationTitle',
      defaultMessage: 'Umsókn um ellilífeyri',
      description: 'Application for old age pension',
    },
    formTitle: {
      id: 'oap.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    prerequisitesSection: {
      id: 'oap.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataSubSection: {
      id: 'oap.application:externalData.subSection',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    checkboxProvider: {
      id: 'oap.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    userProfileInformationTitle: {
      id: 'oap.application:userprofile.title',
      defaultMessage: 'Upplýsingar um fjölskyldu',
      description: 'Family information',
    },
    userProfileInformationSubTitle: {
      id: 'oap.application:userprofile.subtitle',
      defaultMessage:
        'Sækir upplýsingar um þig, maka og börn frá Þjóðskrá. Einnig eru sóttar upplýsingar um búsetu.',
      description:
        'Information about you, spouse and children will be retrieved from Registers Iceland. Information about residence will also be retrieved.',
    },
    skraInformationTitle: {
      id: 'oap.application:userprofile.title',
      defaultMessage: 'Upplýsingar úr prófílgrunni á Ísland.is',
      description: 'Information from the profile base on Ísland.is',
    },
    skraInformationSubTitle: {
      id: 'oap.application:userprofile.subtitle',
      defaultMessage:
        'Sækir upplýsingar um netfang og símanúmer frá mínum síðum Ísland.is.',
      description:
        'Information about email adress and phone number will be retrieved from your account at Ísland.is.',
    },
    confirmationTitle: {
      id: 'oap.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Review and submit',
    },
    questionTitle: {
      id: 'oap.application:question.title',
      defaultMessage: 'Spurningar',
      description: 'Questions',
    },
    pensionFundQuestionTitle: {
      id: 'oap.application:pension.fund.question.title',
      defaultMessage: 'Hefur þú sótt um í öllum þínum lífeyrissjóðum?',
      description: 'Have you applied to all your pension funds?',
    },
    abroadQuestionTitle: {
      id: 'oap.application:abroad.question.title',
      defaultMessage: 'Hefur þú búið/starfað erlendis?',
      description: 'Have you lived/worked abroad?',
    },
    yes: {
      id: 'oal.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'oal.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    startApplication: {
      id: 'oal.application.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
    applicantSection: {
      id: 'oal.application:applicant.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'Applicant information',
    },
    arrangementSection: {
      id: 'oal.application:arrangement.section',
      defaultMessage: 'Tilhögun',
      description: 'Arrangement',
    },
    relatedApplicationsSection: {
      id: 'oap.application:related.applications.section',
      defaultMessage: 'Tengdar umsóknir',
      description: '...',
    },
    commentSection: {
      id: 'oap.application:comment.section',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    confirmationSection: {
      id: 'oap.application:confirmation.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    applicantInfoSubSectionTitle: {
      id: 'oap.application:applicant.info.sub.section.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Information about you',
    },
    applicantInfoSubSectionDescription: {
      id: 'oap.application:applicant.info.sub.section.description',
      defaultMessage:
        'Hérna eru upplýsingar um þig. Vinsamlegast farið yfir netfang og símanúmer til að tryggja að þær upplýsingar séu réttar. Athugið ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim hjá Þjóðskrá og koma svo aftur til að klára umsóknina.',
      description:
        'Here is information about you. Please review the email address and phone number to ensure that the information is correct. Note that if the following information is not correct, it must be changed at Registers Iceland and then come back to complete the application.',
    },
    applicantInfoName: {
      id: 'oap.application:applicant.info.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    applicantInfoId: {
      id: 'oap.application:applicant.info.id',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    applicantInfoAddress: {
      id: 'oap.application:applicant.info.address',
      defaultMessage: 'Póstfang',
      description: 'Postal address',
    },
    applicantInfoPostalcode: {
      id: 'oap.application:applicant.info.postalcode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal code',
    },
    applicantInfoMunicipality: {
      id: 'oap.application:applicant.info.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    applicantInfoEmail: {
      id: 'oap.application:applicant.info.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantInfoPhonenumber: {
      id: 'oap.application:applicant.info.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    applicantInfoMaritalTitle: {
      id: 'oap.application:applicant.info.martial.title',
      defaultMessage: 'Hjúskaparstaða þín',
      description: 'Your marital status',
    },
    applicantInfoMaritalStatus: {
      id: 'oap.application:applicant.info.marital.status',
      defaultMessage: 'Hjúskaparstaða',
      description: 'Marital status',
    },
    applicantInfoSpouseName: {
      id: 'oap.application:applicant.info.spouse.name',
      defaultMessage: 'Nafn maka',
      description: `Spouse's name`,
    },
    residenceHistoryTitle: {
      id: 'oap.application:residence.history.title',
      defaultMessage: 'Búsetusaga',
      description: 'Residence history',
    },
    residenceHistoryDescription: {
      id: 'oap.application:residence.history.description',
      defaultMessage:
        'Hérna eru upplýsingar um búsetusögu þína eftir 1987. Full réttindi af ellilífeyri miðast við samtals 40 ára búsetu á Íslandi á tímabilinu 16-67 ára. Þegar búsetutími á Íslandi er styttri reiknast réttindin hlutfallslega miðað við búsetu. Athugið ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim hjá Þjóðskrá og koma svo aftur til að klára umsóknina.',
      description:
        'Here is information about your residence history after 1987. Full entitlement to old age pension is based on a total of 40 years of residence in Iceland between the ages of 16-67. When the period of residence in Iceland is shorter, the rights are calculated proportionally based on residence. Note that if the following information is not correct, it must be changed at Registers Iceland and then come back to complete the application.',
    },
    pensionFundAlertTitle: {
      id: 'oap.application:pension.fund.alert.title',
      defaultMessage: 'Lífeyrissjóðir',
      description: 'Pension funds',
    },
    pensionFundAlertDescription: {
      id: 'oap.application:pension.fund.alert.description',
      defaultMessage:
        'Þú verður að byrja á því að hafa samband við þá lífeyrissjóði sem þú hefur greitt í áður en þú getur sótt um ellilífeyrir.',
      description:
        'You must start by contacting the pension funds you have paid into before you can apply for a old age pension.',
    },
  }),

  period: defineMessages({
    periodTitle: {
      id: 'oap.application:period.title',
      defaultMessage:
        'Tímabil',
      description:
        'Period',
    },
    periodDescription: {
      id: 'oap.application:period.description',
      defaultMessage:
        'Veldu dagsetningu sem þú vilt byrja að fá greitt ellilífeyri. Hægt er að sækja fyrir árið í ár og 2 ár aftur í tímann.',
      description:
        'Select the date you want to start receiving your retirement pension. You can apply for this year and 2 years back.',
    },
    periodAttachmentForEarlyRetirementTitle: {
      id: 'oap.application:period.attachedment.for.early.retirement.title',
      defaultMessage:
        'Fylgiskjöl vegna snemmtöku',
      description:
        'Early retirement attachment',
    },
    periodAttachmentForEarlyRetirementDescription: {
      id: 'oap.application:period.attachedment.for.early.retirement.description',
      defaultMessage:
        'Hér getur þú skilað yfirliti úr lífeyrisgátt sem þú hefur áunnið þér réttindi í. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit an overview from the pension portal in which you have earned rights. Note that the document must be in .pdf format.',
    },
    periodInputMonth: {
      id: 'oap.application:period.input.month',
      defaultMessage:
        'Mánuður',
      description:
        'Month',
    },
    periodInputMonthDefaultText: {
      id: 'oap.application:period.input.month.default.text',
      defaultMessage:
        'Veldu mánuð',
      description:
        'Select month',
    },
    periodInputYear: {
      id: 'oap.application:period.input.year',
      defaultMessage:
        'Ár',
      description:
        'Year',
    },
    periodInputYearDefaultText: {
      id: 'oap.application:period.input.year.default.text',
      defaultMessage:
        'Veldu ár',
      description:
        'Select year',
    },
    january: {
      id: 'oap.application:period.january',
      defaultMessage:
        'Janúar',
      description:
        'January',
    },
    february: {
      id: 'oap.application:period.february',
      defaultMessage:
        'Febrúar',
      description:
        'February',
    },
    march: {
      id: 'oap.application:period.march',
      defaultMessage:
        'Mars',
      description:
        'March',
    },
    april: {
      id: 'oap.application:period.april',
      defaultMessage:
        'Apríl',
      description:
        'April',
    },
    may: {
      id: 'oap.application:period.may',
      defaultMessage:
        'Maí',
      description:
        'May',
    },
    june: {
      id: 'oap.application:period.june',
      defaultMessage:
        'Júní',
      description:
        'June',
    },
    july: {
      id: 'oap.application:period.july',
      defaultMessage:
        'Júlí',
      description:
        'July',
    },
    agust: {
      id: 'oap.application:period.agust',
      defaultMessage:
        'Águst',
      description:
        'Agust',
    },
    september: {
      id: 'oap.application:period.september',
      defaultMessage:
        'September',
      description:
        'September',
    },
    october: {
      id: 'oap.application:period.october',
      defaultMessage:
        'Október',
      description:
        'October',
    },
    november: {
      id: 'oap.application:period.november',
      defaultMessage:
        'Nóvember',
      description:
        'November',
    },
    desember: {
      id: 'oap.application:period.desember',
      defaultMessage:
        'Desember',
      description:
        'December',
    },
  }),

  errors: defineMessages({
    phoneNumber: {
      id: 'oap.application:error.phonenumber',
      defaultMessage: 'Símanúmerið þarf að vera gilt.',
      description: 'The phone number must be valid.',
    },
  }),
}
