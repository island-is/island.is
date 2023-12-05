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
    yes: {
      id: 'oap.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'oap.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    alertTitle: {
      id: 'oap.application:alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
  }),

  pre: defineMessages({
    prerequisitesSection: {
      id: 'oap.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataSubSection: {
      id: 'oap.application:externalData.sub.section',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    externalDataDescription: {
      id: 'oap.application:externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'english translation',
    },
    checkboxProvider: {
      id: 'oap.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    skraInformationTitle: {
      id: 'oap.application:prerequisites.national.registry.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    skraInformationSubTitle: {
      id: 'oap.application:prerequisites.national.registry.subtitle',
      defaultMessage: 'Upplýsingar um þig og maka. Upplýsingar um búsetu.',
      description:
        'Information about you and spouse. Information about residence.',
    },
    socialInsuranceAdministrationInformationTitle: {
      id: 'oap.application:prerequisites.socialInsuranceAdministration.title',
      defaultMessage: 'Upplýsingar um tekjur og aðstæður',
      description: 'Information about income and circumstances',
    },
    socialInsuranceAdministrationInformationDescription: {
      id: 'oap.application:prerequisites.socialInsuranceAdministration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikningur eru sóttar á mínar síður hjá Tryggingastofnun. Tryggingastofnun sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðsla mála. Þær upplýsingar geta varðað bæði tekjur og aðrar aðstæður þínar. Ef við á þá hefur Tryggingastofnun heimild að ná í upplýsingar frá öðrum stofnunum. Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar, [https://www.tr.is/tryggingastofnun/personuvernd](https://www.tr.is/tryggingastofnun/personuvernd). Ef tekjur eða aðrar aðstæður þínar breytast verður þú að láta Tryggingastofnun vita þar sem það getur haft áhrif á greiðslur þínar.',
      description: 'english translation',
    },
    startApplication: {
      id: 'oap.application:prerequisites.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
    questionTitle: {
      id: 'oap.application:prerequisites.question.title',
      defaultMessage: 'Spurningar',
      description: 'Questions',
    },
    pensionFundAlertDescription: {
      id: 'oap.application:pension.fund.alert.description',
      defaultMessage:
        'Þú verður að byrja á því að hafa samband við þá lífeyrissjóði sem þú hefur greitt í áður en þú getur sótt um ellilífeyrir.',
      description:
        'You must start by contacting the pension funds you have paid into before you can apply for a old age pension.',
    },
    pensionFundQuestionDescription: {
      id: 'oap.application:pension.fund.question.description',
      defaultMessage:
        'Til að geta sótt um ellilífeyri þarft þú staðfestingu á að sótt hafi verið um ellilífeyri hjá öllum lífeyrissjóðum sem þú átt rétt í.',
      description:
        'To be able to apply for old-age pension you must have confirmation that you have applied for old-age pension at all pension funds that you have paid into.',
    },
    fishermenQuestionTitle: {
      id: 'oap.application:fishermen.question.title',
      defaultMessage: 'Sækirðu um ellilífeyri sjómanna?',
      description: 'Are you applying for fishermen old-age pension?',
    },
    applicationTypeTitle: {
      id: 'oap.application:applicationType.title',
      defaultMessage: 'Tegund umsóknar',
      description: 'Type of application',
    },
    applicationTypeDescription: {
      id: 'oap.application:applicationType.description',
      defaultMessage: 'Vinsamlegast veldu tegund umsóknar',
      description: 'Vinsamlegast veldu tegund umsóknar',
    },
    retirementPensionApplicationDescription: {
      id: 'oap.application:retirementPension.application.description',
      defaultMessage:
        'Þeir sem eru 65 ára og eldri og hafa átt lögheimili á Íslandi í minnst þrjú ár gætu átt einhvern rétt á ellilífeyri. Sækja þarf um ellilífeyri en almennt myndast réttur við 67 ára aldur.',
      description:
        'Those who are 65 years of age or older and have had legal residence in Iceland for at least three years may have some right to a retirement pension. You have to apply for retirement pension, but in general you are entitled to it at the age of 67.',
    },
    halfRetirementPensionApplicationTitle: {
      id: 'oap.application:halfRetirementPension.application.title',
      defaultMessage: 'Umsókn um hálfan ellilífeyri',
      description: 'Application for half retirement pension',
    },
    halfRetirementPensionApplicationDescription: {
      id: 'oap.application:halfRetirementPension.application.description',
      defaultMessage:
        'Hægt er að sækja um hálfan ellilífeyri hjá TR samhliða greiðslu hálfs lífeyris frá skyldubundnum atvinnutengdum lífeyrissjóðum.',
      description:
        'You can apply for a half retirement pension from TR together with the payment of half a pension from compulsory employment-related pension funds.',
    },
    fishermenApplicationTitle: {
      id: 'oap.application:fishermen.application.title',
      defaultMessage: 'Umsókn um ellilífeyri sjómanna',
      description: "Fishermen's retirement pension",
    },
    fishermenApplicationDescription: {
      id: 'oap.application:fishermen.application.description',
      defaultMessage:
        'Sá sem hefur stundað sjómennsku á lögskráðu íslensku skipi eða skipi gert út af íslenskum aðilum í 25 ár eða lengur getur átt rétt á ellilífeyri frá 60 ára aldri. Fjöldi lögskráðra daga á sjó þarf að vera að lágmarki 180 dagar að meðaltali á ári á 25 árum.',
      description:
        'Anyone who has practiced seamanship on a registered Icelandic ship or a ship built by Icelandic entities for 25 years or more can be entitled to a retirement pension from the age of 60. The number of legally registered days at sea must be a minimum of 180 days on average per year over 25 years.',
    },
    isNotEligibleLabel: {
      id: 'oap.application:is.not.eligible.label',
      defaultMessage: 'Því miður hefur þú ekki rétt á ellilífeyri',
      description: 'Unfortunately, you are not entitled to old-age pension',
    },
    isNotEligibleDescription: {
      id: 'oap.application:is.not.eligible.description#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi.\n* Þú ert ellilífeyrisþegi eða með umsókn um ellilífeyri í vinnslu.\n\nEf þú telur þessi atriði ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reasons for this could be the following.\n* You are a pensioner or have an application for a old-age pension in progress.\n\nIf you do not think these points apply to you, please contact [tr@tr.is](mailto:tr @tr.is)',
    },
  }),

  applicant: defineMessages({
    applicantSection: {
      id: 'oap.application:applicant.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'Applicant information',
    },
    applicantInfoSubSectionTitle: {
      id: 'oap.application:applicant.info.sub.section.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Information about you',
    },
    applicantInfoSubSectionDescription: {
      id: 'oap.application:applicant.info.sub.section.description',
      defaultMessage:
        'Hérna eru upplýsingar um þig. Vinsamlegast farið yfir netfang og símanúmer til að tryggja að þær upplýsingar séu réttar. Athugið ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim hjá Þjóðskrá.',
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
  }),

  payment: defineMessages({
    title: {
      id: 'oap.application:payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    alertMessage: {
      id: 'oap.application:payment.alert.message',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inná bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inná þann reikning.',
      description:
        'All your payments from TR are paid into the bank account below. If you change your bank details, all your payments from the TR will be paid into that account.',
    },
    alertMessageForeign: {
      id: 'oap.application:payment.alert.message.foreign#markdown',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inn á bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inn á þann reikning. \n\nMikilvægt er að bankaupplýsingarnar séu réttar. Gott er að hafa samband við viðskiptabanka sinn til að ganga úr skugga um að upplýsingarnar séu réttar ásamt því að fá upplýsingar um IBAN-númer og SWIFT-númer. \n\nVinsamlegast athugið að greiðslur inn á erlenda reikninga geta tekið 3-4 daga. Banki sem sér um millifærslu leggur á þjónustugjald fyrir millifærslunni.',
      description: 'english description',
    },
    bank: {
      id: 'oap.application:payment.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    personalAllowance: {
      id: 'oap.application:payment.personal.allowance',
      defaultMessage: 'Vilt þú nýta persónuafsláttinn þinn?',
      description: 'Do you want to use your personal allowance?',
    },
    personalAllowancePercentage: {
      id: 'oap.application:payment.personal.allowance.percentage',
      defaultMessage: 'Skráðu tölu á bilinu 1-100',
      description: 'Enter a number between 1-100',
    },
    taxLevel: {
      id: 'oap.application:payment.tax.level',
      defaultMessage: 'Skattþrep',
      description: 'Tax level',
    },
    alertSpouseAllowance: {
      id: 'oap.application:payment.alert.spouse.allowance',
      defaultMessage:
        'Ef þú vilt nýta persónuafslátt maka þíns þá verður makinn þinn að fara inná mínar síður hjá Tryggingastofnun og veita leyfi.',
      description: 'english translation',
    },
    taxIncomeLevel: {
      id: 'oap.application:payment.tax.first.level',
      defaultMessage:
        'Ég vil að staðgreiðslan sé reiknuð út frá tekjuáætlun minni',
      description:
        'I want the withholding tax to be calculated based on my income estimate',
    },
    taxFirstLevel: {
      id: 'oap.application:payment.tax.second.level',
      defaultMessage:
        'Ég vil að miðað sé við Skattþrep 1 í útreikningum staðgreiðslu (31,45% af tekjum: 0 - 409.986 kr.)',
      description:
        'I want tax level 1 to be taken into account in the withholding calculations (31.45% of income: 0 - 409,986 ISK)',
    },
    taxSecondLevel: {
      id: 'oap.application:payment.tax.third.level',
      defaultMessage:
        'Ég vil að miðað sé við Skattþrep 2 í útreikningum staðgreiðslu (37,95% af tekjum: 409.986 - 1.151.012 kr.)',
      description:
        'I want tax level 2 to be taken into account in the withholding calculations (37.95% of income: ISK 409,986 - ISK 1,151,012)',
    },
    icelandicBankAccount: {
      id: 'oap.application:payment.icelandic.bank.account',
      defaultMessage: 'Íslenskur reikningur',
      description: 'Icelandic account',
    },
    foreignBankAccount: {
      id: 'oap.application:payment.foreign.bank.account',
      defaultMessage: 'Erlendur reikningur',
      description: 'Foreign account',
    },
    iban: {
      id: 'oap.application:payment.iban',
      defaultMessage: 'IBAN',
      description: 'IBAN',
    },
    swift: {
      id: 'oap.application:payment.swift',
      defaultMessage: 'SWIFT',
      description: 'SWIFT',
    },
    bankName: {
      id: 'oap.application:payment.bank.name',
      defaultMessage: 'Heiti banka',
      description: 'Bank name',
    },
    bankAddress: {
      id: 'oap.application:payment.bank.address',
      defaultMessage: 'Heimili banka',
      description: 'Bank address',
    },
    currency: {
      id: 'oap.application:payment.currency',
      defaultMessage: 'Mynt',
      description: 'Currency',
    },
    selectCurrency: {
      id: 'oap.application:payment.select.currency',
      defaultMessage: 'Veldu mynt',
      description: 'Select currency',
    },
  }),

  onePaymentPerYear: defineMessages({
    onePaymentPerYearTitle: {
      id: 'oap.application:one.payment.per.year.title',
      defaultMessage: 'Ein greiðsla á ári',
      description: 'One payment per year',
    },
    onePaymentPerYearDescription: {
      id: 'oap.application:one.payment.per.year.description',
      defaultMessage:
        'Vilt þú óska eftir að fá greiddan lífeyri einu sinni á ári? Þá eru réttindin reiknuð út þegar staðfest skattframtal liggur fyrir og eru greidd út í einu lagi. Ath með því að fá greitt einu sinni á ári fær viðkomandi nákvæmlega það sem hann á rétt á og losnar til dæmis við að fá á sig kröfu við uppgjör vegna ofgreiddra greiðslnna. Reynist inneign vera til staðar verður hún greidd með eingreiðslu þann 1. júní.',
      description: 'description',
    },
    onePaymentPerYearAlertDescription: {
      id: 'oap.application:one.payment.per.year.alert.description',
      defaultMessage:
        'Að óska eftir að fá greiddan lífeyri einu sinni á ári hefur áhrif á allar þínar lífeyrisgreiðslur frá Tryggingastofnun og mánaðargreiðslur þínar munu stöðvast.',
      description: 'description',
    },
  }),

  residence: defineMessages({
    residenceHistoryTitle: {
      id: 'oap.application:residence.history.title',
      defaultMessage: 'Búsetusaga',
      description: 'Residence history',
    },
    residenceHistoryDescription: {
      id: 'oap.application:residence.history.description',
      defaultMessage:
        'Hérna eru upplýsingar um búsetusögu þína eftir 1987. Full réttindi af ellilífeyri miðast við samtals 40 ára búsetu á Íslandi á tímabilinu 16-67 ára. Þegar búsetutími á Íslandi er styttri reiknast réttindin hlutfallslega miðað við búsetu. Athugið ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim hjá Þjóðskrá.',
      description:
        'Here is information about your residence history after 1987. Full entitlement to old age pension is based on a total of 40 years of residence in Iceland between the ages of 16-67. When the period of residence in Iceland is shorter, the rights are calculated proportionally based on residence. Note that if the following information is not correct, it must be changed at Registers Iceland and then come back to complete the application.',
    },
    residenceHistoryQuestion: {
      id: 'oap.application:residence.history.question',
      defaultMessage: 'Hefur þú búið erlendis fyrir árið 1987?',
      description: 'Have you live abroad before 1987?',
    },
    residenceHistoryCountryTableHeader: {
      id: 'oap.application:residence.history.country.table.header',
      defaultMessage: 'Land',
      description: 'Country',
    },
    residenceHistoryPeriodFromTableHeader: {
      id: 'oap.application:residence.history.period.from.table.header',
      defaultMessage: 'Tímabil frá',
      description: 'Period from',
    },
    residenceHistoryPeriodToTableHeader: {
      id: 'oap.application:residence.history.period.to.table.header',
      defaultMessage: 'Tímabil til',
      description: 'Period to',
    },
  }),

  review: defineMessages({
    name: {
      id: 'oap.application:review.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'oap.application:review.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    address: {
      id: 'oap.application:review.address',
      defaultMessage: 'Heimili',
      description: 'Address',
    },
    municipality: {
      id: 'oap.application:review.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    email: {
      id: 'oap.application:review.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phonenumber: {
      id: 'oap.application:review.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'phonenumber',
    },
    spouseName: {
      id: 'oap.application:review.spouse.name',
      defaultMessage: 'Nafn maka',
      description: `Spouse's name`,
    },
    period: {
      id: 'oap.application:review.period',
      defaultMessage: 'Tímabil',
      description: `Period`,
    },
    fishermen: {
      id: 'oap.application:review.fishermen',
      defaultMessage: 'Ellilífeyri sjómanna',
      description: `Fishermen`,
    },
    confirmSectionTitle: {
      id: 'oap.application:confirmation.section.title',
      defaultMessage: 'Staðfesting',
      description: 'Confirm',
    },
    confirmTitle: {
      id: 'oap.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    confirmationDescription: {
      id: 'oap.application:confirmation.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    cancelButton: {
      id: 'oap.application:cancel.button',
      defaultMessage: 'Hætta við',
      description: 'Cancel',
    },
    bank: {
      id: 'oap.application:conformation.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    personalAllowance: {
      id: 'oap.application:conformation.personal.allowance',
      defaultMessage: 'Persónuafláttur',
      description: 'Personal allowance',
    },
    spouseAllowance: {
      id: 'oap.application:conformation.spouse.allowance',
      defaultMessage: 'Persónuafsláttur maka',
      description: 'Spouse personal allowance',
    },
    taxLevel: {
      id: 'oap.application:conformation.tax.level',
      defaultMessage: 'Skattþrep',
      description: 'Tax level',
    },
    ratio: {
      id: 'oap.application:conformation.ratio',
      defaultMessage: 'Hlutall',
      description: 'Ratio',
    },
    overviewTitle: {
      id: 'oap.application:overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    buttonsEdit: {
      id: 'oap.application:buttonsEdit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    pensionAttachment: {
      id: 'oap.application:review.pension.attachment',
      defaultMessage: 'Staðfesting að sótt hafi verið um hjá lífeyrissjóði',
      description:
        'confirmation that an application has been made to a pension fund',
    },
    earlyRetirementAttachment: {
      id: 'oap.application:review.early.retirement.attachment',
      defaultMessage:
        'Yfirlit úr lífeyrisgátt sem þú hefur áunnið þér réttindi í',
      description:
        'Overview from the pension portal in which you have earned rights',
    },
    fishermenAttachment: {
      id: 'oap.application:review.fishermen.attachment',
      defaultMessage:
        'Staðfesting hversu marga daga þú hefur verið lögskráður á sjó',
      description:
        'Confirmation of how many days you have been registered at sea',
    },
    selfEmployedAttachment: {
      id: 'oap.application:review.self.employed.attachment',
      defaultMessage:
        'Staðfesting á lækkun á reiknuðu endurgjaldi (fæst hjá RSK)',
      description:
        'Confirmation of a reduction in the calculated remuneration (available from RSK)',
    },
    additionalDocumentsAttachment: {
      id: 'oap.application:review.additional.documents.attachment',
      defaultMessage: 'Viðbótargögn til Tryggingastofnunar',
      description: 'Additional documents to Tryggingastofnunar',
    },
  }),

  period: defineMessages({
    periodTitle: {
      id: 'oap.application:period.title',
      defaultMessage: 'Tímabil',
      description: 'Period',
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
      defaultMessage: 'Fylgiskjöl vegna snemmtöku',
      description: 'Early retirement attachment',
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
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    periodInputMonthDefaultText: {
      id: 'oap.application:period.input.month.default.text',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },
    periodInputYear: {
      id: 'oap.application:period.input.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    periodInputYearDefaultText: {
      id: 'oap.application:period.input.year.default.text',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    january: {
      id: 'oap.application:period.january',
      defaultMessage: 'Janúar',
      description: 'January',
    },
    february: {
      id: 'oap.application:period.february',
      defaultMessage: 'Febrúar',
      description: 'February',
    },
    march: {
      id: 'oap.application:period.march',
      defaultMessage: 'Mars',
      description: 'March',
    },
    april: {
      id: 'oap.application:period.april',
      defaultMessage: 'Apríl',
      description: 'April',
    },
    may: {
      id: 'oap.application:period.may',
      defaultMessage: 'Maí',
      description: 'May',
    },
    june: {
      id: 'oap.application:period.june',
      defaultMessage: 'Júní',
      description: 'June',
    },
    july: {
      id: 'oap.application:period.july',
      defaultMessage: 'Júlí',
      description: 'July',
    },
    august: {
      id: 'oap.application:period.august',
      defaultMessage: 'Ágúst',
      description: 'August',
    },
    september: {
      id: 'oap.application:period.september',
      defaultMessage: 'September',
      description: 'September',
    },
    october: {
      id: 'oap.application:period.october',
      defaultMessage: 'Október',
      description: 'October',
    },
    november: {
      id: 'oap.application:period.november',
      defaultMessage: 'Nóvember',
      description: 'November',
    },
    desember: {
      id: 'oap.application:period.desember',
      defaultMessage: 'Desember',
      description: 'December',
    },
    periodAlertMessage: {
      id: 'oap.application:period.alert.message',
      defaultMessage:
        'Þú ert að sækja um snemmtöku miðað við valið tímabil. Réttur ellilífeyris myndast 1. næsta mánuð eftir fæðingardag.',
      description:
        'You are applying for early admission based on the selected period. The right to old-age pension is established on the 1st of the following month after birthday.',
    },
    periodAlertLinkTitle: {
      id: 'oap.application:period.alert.linkTitle',
      defaultMessage: 'Nánar um snemmtöku má lesa hér',
      description: 'You can read more about early birding here',
    },
    periodAlertUrl: {
      id: 'oap.application:period.alert.url',
      defaultMessage: 'https://www.tr.is/65/ad-flyta-toku-ellilifeyris',
      description: 'The url the link text links to',
    },
  }),

  conclusionScreen: defineMessages({
    title: {
      id: 'oap.application:conclusionScreen.title',
      defaultMessage: 'Umsókn móttekin og bíður tekjuáætlunar',
      description: 'Congratulations, below are the next steps',
    },
    alertTitle: {
      id: 'oap.application:conclusionScreen.alertTitle',
      defaultMessage:
        'Umsókn vegna ellilífeyris hefur verið send til Tryggingastofnunar en bíður eftir tekjuáætlun til að hægt sé að afgreiða ellilífeyris umsóknina. Þú getur skilað inn tekjuáætlun með því að ýta á takkann hér fyrir neðan.',
      description:
        'The application for old-age pension has been sent to Tryggingastofnunar, but it is waiting for an income estimate so that the old-age pension application can be processed. You can submit an income plan by pressing the button below.',
    },
    bulletList: {
      id: `oap.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Þú verður að skila inn tekjuáætlun, ef ekki búið nú þegar.\n* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til elllífeyris. Vinnslutími umsókna um ellilífeyri er fjórar til sex vikur.\n* **Þú gætir átt rétt á:**\n\t* Heimilisuppbót\n\t* Barnalífeyri\n\t* Uppbót á lífeyri\n\t* Ellilífeyri vegna EES.`,
      description: 'BulletList',
    },
    incomePlanCardLabel: {
      id: 'oap.application:conclusionScreen.incomePlanCardLabel',
      defaultMessage: 'Skila inn tekjuáætlun',
      description: 'Submit an income plan',
    },
    incomePlanCardHeading: {
      id: 'oap.application:conclusionScreen.incomePlanCardHeading',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income plan',
    },
    incomePlanCardText: {
      id: 'oap.application:conclusionScreen.incomePlanCardText',
      defaultMessage:
        'Mikilvægt er að skila inn tekjuáætlun sem fyrst svo hægt sé að afgreiða Ellilífeyris umsóknina og búa til greiðsluáætlun.',
      description:
        'It is important to submit an income estimate as soon as possible so that the Old Age Pension application can be processed and a payment plan can be created.',
    },
    nextStepsLabel: {
      id: 'oap.application:conclusionScreen.nextStepsLabel',
      defaultMessage: 'Hvað gerist næst?',
      description: 'What happens next?',
    },
    nextStepsText: {
      id: 'oap.application:conclusionScreen.nextStepsText',
      defaultMessage:
        'Hjá Tryggingastofnun verður farið yfir umsóknina. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til ellilífeyris.',
      description:
        'The application will be reviewed at the Insurance Agency. If needed, additional information/data is requested. Once all the necessary data have been received, a position is taken on the retirement pension.',
    },
    entitledToLabel: {
      id: 'oap.application:conclusionScreen.entitledToLabel',
      defaultMessage: 'Þú gætir átt rétt á',
      description: 'english translation',
    },
    entitledToBulletList: {
      id: `oap.application:conclusionScreen.entitledToBulletList#markdown`,
      defaultMessage: `* Heimilisuppbót\n* Barnalífeyri\n* Uppbót á lífeyri\n* Ellilífeyri vegna EES`,
      description: 'BulletList',
    },
    buttonsViewApplication: {
      id: 'oap.application:conclusionScreen.buttonsViewApplication',
      defaultMessage: 'Skoða umsókn',
      description: 'View application',
    },
  }),

  fileUpload: defineMessages({
    title: {
      id: 'oap.application:fileUpload.title',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    attachmentButton: {
      id: 'oap.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'oap.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'oap.application:fileUpload.attachment.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description: 'Accepted documents with the following extensions: .pdf',
    },
    attachmentMaxSizeError: {
      id: 'oap.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    earlyRetirementTitle: {
      id: 'oap.application:fileUpload.earlyRetirement.title',
      defaultMessage: 'Fylgiskjöl vegna snemmtöku',
      description: 'Early retirement attachment',
    },
    earlyRetirementDescription: {
      id: 'oap.application:fileUpload.earlyRetirement.description',
      defaultMessage:
        'Hér getur þú skilað yfirliti úr lífeyrisgátt sem þú hefur áunnið þér réttindi í. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit an overview from the pension portal in which you have earned rights. Note that the document must be in .pdf format.',
    },
    pensionFileTitle: {
      id: 'oap.application:fileUpload.pensionFile.title',
      defaultMessage: 'Fylgiskjöl lífeyrissjóða',
      description: 'Pension fund attachment',
    },
    pensionFileDescription: {
      id: 'oap.application:fileUpload.pensionFile.description',
      defaultMessage:
        'Hér getur þú skilað staðfestingu greiðslna hjá lífeyrissjóði. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can return confirmation of payments to the pension fund. Note that the document must be in .pdf format.',
    },
    fishermenFileTitle: {
      id: 'oap.application:fileUpload.sailor.title',
      defaultMessage: 'Fylgiskjöl sjómanna',
      description: 'Fishermen attachment',
    },
    fishermenFileDescription: {
      id: 'oap.application:fileUpload.sailor.description',
      defaultMessage:
        'Hér getur þú skilað gögnum sem staðfesta hversu marga daga þú hefur verið lögskráður á sjó. Dæmi um slík gögn eru; Yfirlit af stöðuskráningu sjómanns frá Samgöngustofu, sjóferðabækur sem gefnar voru út af Siglingastofnun Íslands, skattframtöl eða siglingavottorð frá Sýslumanni. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit data confirming how many days you have been legally registered at sea. Examples of such data are; An overview of the seafarers status registration from the Transport Agency, sea voyage books published by the Icelandic Maritime Administration, tax returns or sailing certificates from the County Commissioner. Note that the document must be in .pdf format.',
    },
    additionalFileTitle: {
      id: 'oap.application:fileUpload.additionalFile.title',
      defaultMessage: 'Viðbótagögn',
      description: 'Additional attachments',
    },
    additionalFileDescription: {
      id: 'oap.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis staðfestingu frá Þjóðskrá vegna rangra upplýsinga. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit additional data to TR. For example, confirmation from the National Registry due to incorrect information. Note that the document must be in .pdf format.',
    },
    selfEmployedTitle: {
      id: 'oap.application:fileUpload.selfEmployed.title',
      defaultMessage: 'Fylgiskjöl reiknað endurgjald',
      description: "Self-employed's attachment",
    },
    selfEmployedSubTitle: {
      id: 'oap.application:fileUpload.selfEmployed.sub.title',
      defaultMessage: 'Fylgiskjöl endurgjald',
      description: 'Self-employed attachment',
    },
    selfEmployedDescription: {
      id: 'oap.application:fileUpload.selfEmployed.description',
      defaultMessage:
        'Hér getur þú skilað staðfestingu á lækkun á reiknuðu endurgjaldi (fæst hjá RSK). Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit confirmation of a reduction in the calculated remuneration (available from RSK). Note that the document must be in .pdf format.',
    },
    additionalDocumentRequired: {
      id: 'oap.application:fileUpload.additionalDocumentRequired',
      defaultMessage:
        'Viðbótargögn krafist, vinsamlegast hlaðið viðbótargögn á næstu síðu',
      description:
        'Additional document(s) required, on the next page you will be able to upload the additional document(s), to begin please press continue.',
    },
    additionalDocumentsEditSubmit: {
      id: 'oap.application:fileUpload.additionalDocumentsEditSubmit',
      defaultMessage: 'Senda inn',
      description: 'Submit',
    },
    additionalDocumentRequiredTitle: {
      id: 'oap.application:fileUpload.additionalDocumentRequired.title',
      defaultMessage: 'Viðbótargögn krafist',
      description: 'Additional attachments required',
    },
    additionalDocumentRequiredDescription: {
      id: 'oap.application:fileUpload.additionalDocumentRequired.description#markdown',
      defaultMessage:
        'Vinsamlegast hlaðið upp viðbótargögnum til Tryggingastofnunar. Ef þú ert ekki viss hvaða viðbótagögn það eru geturu séð það í pósthólfinu þínu. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description: 'english translation',
    },
    foreignBankAccountFileTitle: {
      id: 'oap.application:fileUpload.foreignBankAccountFile.title',
      defaultMessage: 'Staðfesting vegna erlends bankareiknings',
      description: 'Confirmation for a foreign bank account',
    },
    foreignBankAccountFileDescription: {
      id: 'oap.application:fileUpload.foreignBankAccountFile.description',
      defaultMessage:
        'Hér getur þú skilað skilað inn staðfestingu á erlendum bankareikningi. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit confirmation of a foreign bank account. Note that the document must be in .pdf format.',
    },
  }),

  comment: defineMessages({
    additionalInfoTitle: {
      id: 'oap.application:comment.additional.info.title',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional Information',
    },
    commentSection: {
      id: 'oap.application:comment.section',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    description: {
      id: 'oap.application:comment.description',
      defaultMessage: 'Hafir þú einhverja athugasemd skildu hana eftir hér.',
      description: 'If you have any comments, leave them here.',
    },
    placeholder: {
      id: 'oap.application:comment.placeholder',
      defaultMessage: 'Skrifaðu hér athugasemd',
      description: 'Your comment',
    },
  }),

  employer: defineMessages({
    employerTitle: {
      id: 'oap.application:employer.employerTitle',
      defaultMessage: 'Vinnuveitendur',
      description: 'Employers',
    },
    employerDescription: {
      id: 'oap.application:employer.employerDescription',
      defaultMessage:
        'Hver og einn skráður vinnuveitandi þarf að staðfesta starfshlutfall þitt. Þegar þú hefur sent umsóknina verður sendur tölvupóstur og sms til vinnuveitenda. Viðtakendur fá aðgang að umsókninni, en getur einungis séð upplýsingar sem varða starfshlutfall þitt. Ef einhver skráðra vinnuveitenda hafna þarft þú að gera viðeigandi breytingar á umsókninni.',
      description:
        'Each registered employer must verify your employment rate. Once you have submitted the application, an email and SMS will be sent to the employers. Recipients get access to the application, but can only see information related to your employment rate. If any of the registered employers reject you, you need to make the appropriate changes to the application.',
    },
    selfEmployedOrEmployeeTitle: {
      id: 'oap.application:employer.selfEmployedOrEmployeeTitle',
      defaultMessage: 'Sjálfstætt starfandi eða launþegi?',
      description: 'Self-employed or employee?',
    },
    selfEmployedOrEmployeeDescription: {
      id: 'oap.application:employer.selfEmployedOrEmployee.description',
      defaultMessage:
        'Ef þú ert sjálfstætt starfandi þarft þú að skila inn staðfestingu frá Skattinum á lækkun á reiknuðu endurgjaldi. Ef þú ert launþegi þarft þú að skrá þinn vinnuveitanda svo hann geti samþykkt starfshlutfallið þitt.',
      description:
        'If you are self-employed, you must submit confirmation from the Tax Office of a reduction in the calculated remuneration. If you are an employee, you need to register your employer so that they can approve your employment rate.',
    },
    selfEmployed: {
      id: 'oap.application:employer.selfEmployed',
      defaultMessage: 'Sjálfstætt starfandi',
      description: 'Self-employed',
    },
    employee: {
      id: 'oap.application:employer.employee',
      defaultMessage: 'Launþegi',
      description: 'Employee',
    },
    registrationTitle: {
      id: 'oap.application:employer.registration.title',
      defaultMessage: 'Skráning vinnuveitanda',
      description: 'Register an employer',
    },
    email: {
      id: 'oap.application:employer.email',
      defaultMessage: 'Netfang vinnuveitanda (aðeins eitt netfang leyfilegt)',
      description: 'Employer email (only one email address allowed)',
    },
    emailHeader: {
      id: 'oap.application:employer.email.header',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phoneNumber: {
      id: 'oap.application:employer.phone.number',
      defaultMessage: 'Símanúmer vinnuveitanda ( valfrjálst )',
      description: "Employer's phone number ( optional )",
    },
    phoneNumberHeader: {
      id: 'oap.application:employer.phone.number.header',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    ratio: {
      id: 'oap.application:employer.ratio',
      defaultMessage: 'Starfshlutfall',
      description: 'Employment ratio',
    },
    totalRatio: {
      id: 'oap.application:employer.total.ratio',
      defaultMessage: 'Heildar starfshlutfall',
      description: 'Total employment ratio',
    },
    ratioMonthly: {
      id: 'oap.application:employer.ratio.monthly',
      defaultMessage: 'Starfshlutfall á mánuði',
      description: 'Employment ratio per month',
    },
    ratioYearly: {
      id: 'oap.application:employer.ratio.yearly',
      defaultMessage: 'Starfshlutfall á ári',
      description: 'Employment ratio per year',
    },
    ratioHeader: {
      id: 'oap.application:employer.ratio.header',
      defaultMessage: 'Starfshlutfall',
      description: 'Ratio',
    },
    addEmployerError: {
      id: 'oap.application:employer.add.error',
      defaultMessage: 'Nauðsynlegt er að bæta við amk einum vinnuveitanda',
      description: 'It is required to add at least one employer',
    },
    addEmployer: {
      id: 'oap.application:employer.add',
      defaultMessage: 'Bæta við vinnuveitanda',
      description: 'Add an employer',
    },
    approvedHeader: {
      id: 'oap.application:employer.approved.header',
      defaultMessage: 'Samþykkt',
      description: 'Approved',
    },
    month: {
      id: 'oap.application:employer.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    monthlyAvgDescription: {
      id: 'oap.application:employer.monthly.avg.description',
      defaultMessage: 'Mánaðarskipting á ársgrundvelli',
      description: 'Monthly distribution on an annual basis',
    },
  }),
}

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'oap.application:error.phonenumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  bank: {
    id: 'oap.application:error.bank',
    defaultMessage: 'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
    description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
  },
  period: {
    id: 'oap.application:error.period',
    defaultMessage: 'Tímabil þarf að vera gilt.',
    description: 'The period must be valid.',
  },
  noEmailFound: {
    id: 'oap.application:error.no.email.found.title',
    defaultMessage: 'Ekkert netfang skráð',
    description: 'english translation',
  },
  noEmailFoundDescription: {
    id: 'oap.application:error.no.email.found.description',
    defaultMessage:
      'Þú ert ekki með skráð netfang hjá Tryggingastofnun. Vinsamlegast skráðu það inná mínum síðum á tr.is og komdu svo aftur til að sækja um ellilífeyri.',
    description: 'english translation',
  },
  iban: {
    id: 'oap.application:error.iban',
    defaultMessage: 'Ógilt IBAN',
    description: 'Invalid IBAN',
  },
  swift: {
    id: 'oap.application:error.swift',
    defaultMessage: 'Ógilt SWIFT',
    description: 'Invalid SWIFT',
  },
})

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
    defaultMessage: 'Ógilt ár.',
    description: 'Invalid year.',
  },
  periodMonth: {
    id: 'oap.application:period.month',
    defaultMessage: 'Ógildur mánuður.',
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
    id: 'oap.application:employers.employers.not.a.list',
    defaultMessage: 'Svar þarf að vera listi af atvinnurekanda',
    description: 'Copy when employers is not a list',
  },
  employersRatioMoreThan50: {
    id: 'oap.application:employers.ratio.more.than.50',
    defaultMessage: 'Starfshlutfall má ekki vera meira en 50%',
    description: 'Employment rate must be less than or equal 50%',
  },
  employersUnexpectedError: {
    id: 'oap.application:employers.periods.unexpected.error',
    defaultMessage: 'Óvænt villa kom upp',
    description: 'Copy when an unexpected error occurs',
  },
  totalEmployersRatioMoreThan50: {
    id: 'oap.application:total.employers.ratio.more.than.50',
    defaultMessage: 'Summa starfshlutfalls má ekki vera meira en 50%',
    description: 'Sumary of Employment rate must be less than or equal 50%',
  },
  employersCouldNotContinue: {
    id: 'oap.application:employers.periods.could.not.continue',
    defaultMessage: 'Þú þarft að skrá atvinnurekanda',
    description:
      'Copy when employers list is empty and user is trying to continue',
  },
  employersRatioLessThan0: {
    id: 'oap.application:employers.ratio.less.than.0',
    defaultMessage: 'Starfshlutfall má ekki vera minni en 1%',
    description: 'Employment rate must be more than 0%',
  },
  employerRatioMissing: {
    id: 'oap.application:employer.ratio.missing',
    defaultMessage: 'Starfshlutfall vantar',
    description: 'Employer rate missing',
  },
  employersPhoneNumberInvalid: {
    id: 'oap.application:employer.phoneNumber.invalid',
    defaultMessage: 'Símanúmer verður að vera GSM númer',
    description: 'Phone number must be a GSM number',
  },
  personalAllowance: {
    id: 'oap.application:payment.personal.allowance.error',
    defaultMessage: 'Persónuafsláttur verður að vera milli 1 og 100',
    description: 'Personal allowace has to be between 1 and 100',
  },
})

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'oap.application:inReview.form.title',
    defaultMessage: 'Umsókn vegna ellilífeyris',
    description: 'Old age pension',
  },
})

export const statesMessages = defineMessages({
  draftDescription: {
    id: 'oap.application:draft.description',
    defaultMessage: 'Þú hefur útbúið drög að umsókn.',
    description: 'Description of the state - draft',
  },
  tryggingastofnunSubmittedTitle: {
    id: 'oap.application:tryggingastofnunSubmittedTitle',
    defaultMessage: 'Umsókn hefur verið send til Tryggingastofnunnar',
    description: 'The application has been sent to Tryggingastofnunnar',
  },
  tryggingastofnunSubmittedContent: {
    id: 'oap.application:tryggingastofnunSubmittedContent',
    defaultMessage:
      'Umsóknin þín er í bið eftir yfirferð. Hægt er að breyta umsókn þar til umsókn er komin í yfirferð.',
    description: 'Application waiting for review',
  },
  tryggingastofnunInReviewTitle: {
    id: 'oap.application:tryggingastofnunInReviewTitle',
    defaultMessage: 'Verið er að fara yfir umsóknina',
    description: 'The application is being reviewed',
  },
  tryggingastofnunInReviewContent: {
    id: 'oap.application:tryggingastofnunInReviewContent',
    defaultMessage:
      'Tryggingastofnun fer núna yfir umsóknina og því getur þetta tekið nokkra daga',
    description:
      'Tryggingastofnun is currently reviewing the application, so this may take a few days',
  },
  applicationEdited: {
    id: 'oap.application:applicationEdited',
    defaultMessage: 'Umsókn breytt',
    description: 'Application edited',
  },
  applicationRejected: {
    id: 'oap.application:applicationRejected',
    defaultMessage: 'Umsókn hafnað',
    description: 'Application rejected',
  },
  applicationRejectedDescription: {
    id: 'oap.application:applicationRejectedDescription',
    defaultMessage: 'Umsókn vegna ellilífeyris hefur verið hafnað',
    description: 'The application for old-age pension has been rejected',
  },
  applicationApproved: {
    id: 'oap.application:applicationApproved',
    defaultMessage: 'Tryggingastofnun hefur samþykkt umsóknina',
    description: 'Tryggingastofnun has accepted the application',
  },
  applicationApprovedDescription: {
    id: 'oap.application:applicationApprovedDescription',
    defaultMessage: 'Umsókn vegna ellilífeyris hefur verið samþykkt',
    description: 'The application for old-age pension has been approved',
  },
  additionalDocumentRequired: {
    id: 'oap.application:additionalDocumentRequired',
    defaultMessage: 'Viðbótargögn vantar',
    description: 'Additional documents required',
  },
  additionalDocumentsAdded: {
    id: 'oap.application:additionalDocumentsAdded',
    defaultMessage: 'Viðbótargögnum bætt við',
    description: 'Additional documents added',
  },
  additionalDocumentRequiredDescription: {
    id: 'oap.application:additionalDocumentRequired.description',
    defaultMessage: 'Tryggingastofnun vantar frekari gögn vegna umsóknarinnar.',
    description: 'Description of the state - additionalDocumentRequired',
  },
  pendingTag: {
    id: 'oap.application:pending.tag',
    defaultMessage: 'Í bið',
    description: 'Pending',
  },
  applicationPending: {
    id: 'oap.application:applicationPending',
    defaultMessage: 'Umsókn í bið hjá Tryggingastofnun',
    description: 'Application pending at Tryggingastofnun',
  },
  applicationPendingDescription: {
    id: 'oap.application:applicationPendingDescription',
    defaultMessage: 'Umsókn vegna ellilífeyris hefur verið sett í bið.',
    description: 'The application for old-age pension has been put on hold.',
  },
  applicationDismissed: {
    id: 'oap.application:applicationDismissed',
    defaultMessage: 'Umsókn hefur verið vísað frá',
    description: 'Application has been dismissed',
  },
  applicationDismissedDescription: {
    id: 'oap.application:applicationDismissedDescription',
    defaultMessage: 'Umsókn vegna ellilífeyris hefur verið vísað frá.',
    description: 'The application for old-age pension has been dismissed.',
  },
})
