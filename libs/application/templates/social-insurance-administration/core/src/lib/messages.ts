import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const socialInsuranceAdministrationMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'sia.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Social Insurance Administration',
    },
    formTitle: {
      id: 'sia.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'sia.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'sia.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    alertTitle: {
      id: 'sia.application:alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
  }),

  pre: defineMessages({
    externalDataSection: {
      id: 'sia.application:externalData.section',
      defaultMessage: 'Gagnaöflun',
      description: 'Data collection',
    },
    externalDataDescription: {
      id: 'sia.application:externalData.description',
      defaultMessage: 'Eftirfarandi upplýsingar verða sóttar rafrænt',
      description: 'The following information will be retrieved electronically',
    },
    checkboxProvider: {
      id: 'sia.application:prerequisites.checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra upplýsinga verður aflað í umsóknarferlinu',
      description:
        'I understand that the above information will be collected during the application process',
    },
    skraInformationTitle: {
      id: 'sia.application:prerequisites.national.registry.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    contactInfoTitle: {
      id: 'sia.application:prerequisites.contact.info.title',
      defaultMessage: 'Mínar upplýsingar á Mínum síðum Ísland.is',
      description: 'My information on My pages Ísland.is',
    },
    contactInfoDescription: {
      id: 'sia.application:prerequisites.contact.info.description',
      defaultMessage:
        'Upplýsingar um símanúmer og netfang til að auðvelda umsóknarferlið.',
      description:
        'Information about your telephone number and email address to facilitate the application process.',
    },
    socialInsuranceAdministrationTitle: {
      id: 'sia.application:prerequisites.social.insurance.administration.title',
      defaultMessage: 'Upplýsingar frá Tryggingastofnun',
      description: 'Information from Social Insurance Administration',
    },
    socialInsuranceAdministrationDescription: {
      id: 'sia.application:prerequisites.social.insurance.administration.description',
      defaultMessage:
        'Upplýsingar um bankareikning sóttar á mínar síður hjá Tryggingastofnun.',
      description:
        'Information regarding bank account is retrieved from My Pages at the Social Insurance Administration.',
    },
    socialInsuranceAdministrationInformationTitle: {
      id: 'sia.application:prerequisites.socialInsuranceAdministration.title',
      defaultMessage: 'Upplýsingar um tekjur og aðstæður',
      description: 'Information regarding income and circumstances',
    },
    socialInsuranceAdministrationDataDescription: {
      id: 'sia.application:prerequisites.socialInsuranceAdministration.data.description',
      defaultMessage:
        'Tryggingastofnun sækir nauðsynlegar upplýsingar til úrvinnslu umsókna, varðandi tekjur og aðrar ástæður.',
      description: 'english translation',
    },
    socialInsuranceAdministrationPrivacyTitle: {
      id: 'sia.application:prerequisites.socialInsuranceAdministration.privacy.title',
      defaultMessage: 'Gagnaöflun og meðferð persónuupplýsinga',
      description: 'english translation',
    },
    socialInsuranceAdministrationPrivacyDescription: {
      id: 'sia.application:prerequisites.socialInsuranceAdministration.privacy.description#markdown',
      defaultMessage:
        'Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna hér (https://www.tr.is/tryggingastofnun/personuvernd). Ef tekjur eða aðrar aðstæður þínar breytast verður þú að láta Tryggingastofnun vita þar sem það getur haft áhrif á greiðslur þínar.',
      description: 'english translation',
    },
    socialInsuranceAdministrationPrivacyWithoutIncomeDescription: {
      id: 'sia.application:prerequisites.socialInsuranceAdministration.privacy.without.income.description#markdown',
      defaultMessage:
        'Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna hér (https://www.tr.is/tryggingastofnun/personuvernd).',
      description: 'english translation',
    },
    startApplication: {
      id: 'sia.application:prerequisites.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
  }),

  info: defineMessages({
    section: {
      id: 'sia.application:info.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'General information',
    },
    infoSubSectionTitle: {
      id: 'sia.application:applicant.info.sub.section.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Information about you',
    },
    infoSubSectionDescription: {
      id: 'sia.application:applicant.info.sub.section.description#markdown',
      defaultMessage:
        'Vinsamlegast farið yfir netfang og símanúmer til að tryggja að þær upplýsingar séu réttar. Netfangi er breytt hér. Athugið að ef að aðrar upplýsingar eru ekki réttar þarft þú að breyta þeim í Þjóðskrá.',
      description:
        'Please review the email address and phone number to ensure that the information is correct. Email address can be changed here. Note that if any other information is not correct, you must have it changed at Registers Iceland.',
    },
    applicantEmail: {
      id: 'sia.application:info.applicant.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantPhonenumber: {
      id: 'sia.application:info.applicant.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    applicantMaritalTitle: {
      id: 'sia.application:info.applicant.martial.title',
      defaultMessage: 'Hjúskaparstaða þín',
      description: 'Your marital status',
    },
    applicantMaritalStatus: {
      id: 'sia.application:info.applicant.marital.status',
      defaultMessage: 'Hjúskaparstaða',
      description: 'Marital status',
    },
    applicantSpouseName: {
      id: 'sia.application:info.applicant.spouse.name',
      defaultMessage: 'Nafn maka',
      description: `Spouse's name`,
    },
    applicantAddress: {
      id: 'sia.application:info.applicant.address',
      defaultMessage: 'Póstfang',
      description: 'Postal address',
    },
    applicantApartmentNumber: {
      id: 'sia.application:info.applicant.apartment.number',
      defaultMessage: 'Íbúðarnúmer',
      description: 'Apartment number',
    },
    applicantPostalcode: {
      id: 'sia.application:info.applicant.postalcode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal code',
    },
    applicantMunicipality: {
      id: 'sia.application:info.applicant.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
  }),

  period: defineMessages({
    title: {
      id: 'sia.application:period.title',
      defaultMessage: 'Tímabil',
      description: 'Period',
    },
    overviewTitle: {
      id: 'sia.application:period.overviewTitle',
      defaultMessage: 'Frá hvaða tíma er sótt um?',
      description: 'Period',
    },
    year: {
      id: 'sia.application:period.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    yearDefaultText: {
      id: 'sia.application:period.year.default.text',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    month: {
      id: 'sia.application:period.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    monthDefaultText: {
      id: 'sia.application:period.month.default.text',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },
  }),

  months: defineMessages({
    january: {
      id: 'sia.application:months.january',
      defaultMessage: 'Janúar',
      description: 'January',
    },
    february: {
      id: 'sia.application:months.february',
      defaultMessage: 'Febrúar',
      description: 'February',
    },
    march: {
      id: 'sia.application:months.march',
      defaultMessage: 'Mars',
      description: 'March',
    },
    april: {
      id: 'sia.application:months.april',
      defaultMessage: 'Apríl',
      description: 'April',
    },
    may: {
      id: 'sia.application:months.may',
      defaultMessage: 'Maí',
      description: 'May',
    },
    june: {
      id: 'sia.application:months.june',
      defaultMessage: 'Júní',
      description: 'June',
    },
    july: {
      id: 'sia.application:months.july',
      defaultMessage: 'Júlí',
      description: 'July',
    },
    august: {
      id: 'sia.application:months.august',
      defaultMessage: 'Ágúst',
      description: 'August',
    },
    september: {
      id: 'sia.application:months.september',
      defaultMessage: 'September',
      description: 'September',
    },
    october: {
      id: 'sia.application:months.october',
      defaultMessage: 'Október',
      description: 'October',
    },
    november: {
      id: 'sia.application:months.november',
      defaultMessage: 'Nóvember',
      description: 'November',
    },
    desember: {
      id: 'sia.application:months.desember',
      defaultMessage: 'Desember',
      description: 'December',
    },
  }),

  payment: defineMessages({
    title: {
      id: 'sia.application:payment.title',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Payment information',
    },
    alertMessage: {
      id: 'sia.application:payment.alert.message',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inn á bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inn á þann reikning.',
      description:
        'All payments from the Social Insurance Administration are paid into the below bank account. Should you change your account details all your payments from the Social Insurance Administration will be paid into that account.',
    },
    alertMessageForeign: {
      id: 'sia.application:payment.alert.message.foreign#markdown',
      defaultMessage:
        'Allar þínar greiðslur frá Tryggingastofnun eru greiddar inn á bankareikninginn hér að neðan. Ef þú breytir bankaupplýsingunum þínum munu allar þínar greiðslur frá Tryggingastofnun verða greiddar inn á þann reikning. \n\nMikilvægt er að bankaupplýsingarnar séu réttar. Gott er að hafa samband við viðskiptabanka sinn til að ganga úr skugga um að upplýsingarnar séu réttar ásamt því að fá upplýsingar um IBAN-númer og SWIFT-númer. \n\nVinsamlegast athugið að greiðslur inn á erlenda reikninga geta tekið 3-4 daga. Banki sem sér um millifærslu leggur á þjónustugjald fyrir millifærslunni.',
      description:
        'All payments from the Social Insurance Administration are paid into the below bank account. Should you change your account details, all your payments from the Social Insurance Administration will be paid into that account. \n\nIt is important to ensure that that the bank details are correct. We advise that applicants contact their commercial bank to make sure all bank details are correct, as well as confirming details regarding IBAN and SWIFT numbers. \n\nPlease note that payments made into foreign accounts can take 3-4 days. The bank that handles the transaction will charge a service fee.',
    },
    bank: {
      id: 'sia.application:payment.bank',
      defaultMessage: 'Banki',
      description: 'Bank',
    },
    icelandicBankAccount: {
      id: 'sia.application:payment.icelandic.bank.account',
      defaultMessage: 'Íslenskur reikningur',
      description: 'Icelandic account',
    },
    foreignBankAccount: {
      id: 'sia.application:payment.foreign.bank.account',
      defaultMessage: 'Erlendur reikningur',
      description: 'Foreign account',
    },
    iban: {
      id: 'sia.application:payment.iban',
      defaultMessage: 'IBAN',
      description: 'IBAN',
    },
    swift: {
      id: 'sia.application:payment.swift',
      defaultMessage: 'SWIFT',
      description: 'SWIFT',
    },
    bankName: {
      id: 'sia.application:payment.bank.name',
      defaultMessage: 'Heiti banka',
      description: 'Bank name',
    },
    bankAddress: {
      id: 'sia.application:payment.bank.address',
      defaultMessage: 'Heimili banka',
      description: 'Bank address',
    },
    personalAllowancePlaceholder: {
      id: 'sia.application:payment.personal.allowance.placeholder',
      defaultMessage: '1%',
      description: '1%',
    },
    currency: {
      id: 'sia.application:payment.currency',
      defaultMessage: 'Mynt',
      description: 'Currency',
    },
    selectCurrency: {
      id: 'sia.application:payment.select.currency',
      defaultMessage: 'Veldu mynt',
      description: 'Select currency',
    },
    personalAllowance: {
      id: 'sia.application:payment.personal.allowance',
      defaultMessage: 'Vilt þú nýta persónuafsláttinn þinn?',
      description: 'Would you like to use your personal tax-free allowance?',
    },
    personalAllowancePercentage: {
      id: 'sia.application:payment.personal.allowance.percentage',
      defaultMessage: 'Skráðu tölu á bilinu 1-100',
      description: 'Enter a number between 1 and 100',
    },
    alertSpouseAllowance: {
      id: 'sia.application:payment.alert.spouse.allowance',
      defaultMessage:
        'Ef þú vilt nýta persónuafslátt maka þíns þá verður makinn þinn að fara inná mínar síður hjá Tryggingastofnun og veita leyfi.',
      description:
        "If you wish to use your spouse's personal discount, your spouse must log into My Pages at the Social Insurance Administration and grant their permission.",
    },
    taxLevel: {
      id: 'sia.application:payment.tax.level',
      defaultMessage: 'Skattþrep',
      description: 'Tax bracket',
    },
    taxIncomeLevel: {
      id: 'sia.application:payment.tax.first.level',
      defaultMessage:
        'Ég vil að staðgreiðslan sé reiknuð út frá tekjuáætlun minni',
      description:
        'I wish for the withholding tax to be calculated based on my income estimate',
    },
    taxFirstLevel: {
      id: 'sia.application:payment.tax.second.level',
      defaultMessage:
        'Ég vil að miðað sé við Skattþrep 1 í útreikningum staðgreiðslu (31,45% af tekjum: 0 - 409.986 kr.)',
      description:
        'I wish for tax bracket 1 to be considered in my withholding calculations (31.45% of income: 0 - 409,986 ISK)',
    },
    taxSecondLevel: {
      id: 'sia.application:payment.tax.third.level',
      defaultMessage:
        'Ég vil að miðað sé við Skattþrep 2 í útreikningum staðgreiðslu (37,95% af tekjum: 409.986 - 1.151.012 kr.)',
      description:
        'I wish for tax bracket 2 to be considered in my withholding calculations (37.95% of income: ISK 409,986 - ISK 1,151,012)',
    },
  }),

  fileUpload: defineMessages({
    title: {
      id: 'sia.application:fileUpload.title',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    additionalFileDescription: {
      id: 'sia.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar ef þú telur þörf á.',
      description:
        'Below you can submit additional data to the Social Insurance Administration, if need be.',
    },
    attachmentButton: {
      id: 'sia.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'sia.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'sia.application:fileUpload.attachment.description',
      defaultMessage:
        'Tekið er við skjölum með endingu: .pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png',
      description:
        'The following document types are accepted: .pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png',
    },
    attachmentMaxSizeError: {
      id: 'sia.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    additionalFileTitle: {
      id: 'sia.application:fileUpload.additionalFile.title',
      defaultMessage: 'Fylgiskjöl viðbótargögn',
      description: 'Additional attachments',
    },

    additionalDocumentsEditSubmit: {
      id: 'sia.application:fileUpload.additionalDocumentsEditSubmit',
      defaultMessage: 'Senda inn',
      description: 'Submit',
    },
    additionalDocumentRequiredTitle: {
      id: 'sia.application:fileUpload.additionalDocumentRequired.title',
      defaultMessage: 'Viðbótargagna krafist',
      description: 'Additional documents required',
    },
    additionalDocumentRequiredDescription: {
      id: 'sia.application:fileUpload.additionalDocumentRequired.description#markdown',
      defaultMessage:
        'Vinsamlegast hlaðið upp viðbótargögnum til Tryggingastofnunar. Ef þú ert ekki viss hvaða viðbótagögn það eru geturu séð það í [stafræna pósthólfinu þínu](https://island.is/minarsidur/postholf). Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Please submit additional documents for the Social Insurance Administration. If you are not sure which additional documents you should submit, you can see it in [your inbox on My Pages](https://island.is/minarsidur/postholf). Note that the document must be in .pdf format.',
    },
  }),

  additionalInfo: defineMessages({
    section: {
      id: 'sia.application:additionalInfo.section',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Additional Information',
    },
    commentSection: {
      id: 'sia.application:additionalInfo.comment.section',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    commentDescription: {
      id: 'sia.application:additionalInfo.comment.description',
      defaultMessage: 'Hafir þú einhverja athugasemd skildu hana eftir hér.',
      description: 'Please leave any additional comments below.',
    },
    commentPlaceholder: {
      id: 'sia.application:additionalInfo.comment.placeholder',
      defaultMessage: 'Skrifaðu athugasemd hér',
      description: 'Your comment',
    },
  }),

  incomePlanInstructions: defineMessages({
    title: {
      id: 'sia.application:income.plan.instructions.title',
      defaultMessage: 'Leiðbeiningar um skráningu tekjuáætlunar',
      description: 'Instructions on filling out your income plan',
    },
    instructions: {
      id: 'sia.application:income.plan.instructions#markdown',
      defaultMessage:
        '\n* Á næstu síðu er að finna tillögu að tekjuáætlun. Þar getur þú breytt upphæðum og bætt við tekjum.\n* Skrá skal heildartekjur fyrir skatt í tekjuáætlun.\n* Fjármagnstekjur eru sameignlegar hjá hjónum/sambúðarfólki og skal skrá heildar fjármagnstekjur hjóna/sambúðarfólks í tekjuáætlun.\n* Ef maki er á lífeyri verða greiðslur hans einnig endurreiknaðar ef fjármagnstekjum er breytt.\n* Heimilt er að skrá atvinnutekjur á þá mánuði sem þeirra er aflað. Reiknast þá þær atvinnutekjur eingöngu í þeim mánuði. Vakin er athygli á að það þarf að haka sérstaklega við þann kost að óska eftir mánaðarskiptingu atvinnutekna í tekjuáætlun.\n* Laun / lífeyrisgreiðslur skal skrá í þeim gjaldmiðli sem þau eru greidd.\n* Það er á ábyrgð umsækjanda að tekjuáætlun sé rétt og að nauðsynlegar upplýsingar liggi fyrir til að hægt sé að ákvarða réttar greiðslur.',
      description:
        '\n* On the next page you will find your proposed income plan. There you can edit amounts and add income categories.\n* You must submit your total pre-tax income in your income plan.\n* For couples, their total income must be recorded in the income plan, as their income is considered shared.\n* If a spouse is receiving disability, his or her benefits will also be recalculated if there is a change in income.\n* Income may be recorded in the month in which it is earned. The income is then calculated only for that month. Attention, it is necessary to select the option of requesting a monthly distribution of income in the income plan.\n* Salary / pension payments must be recorded in the currency in which they are paid.\n* It is the responsibility of the applicant that the income plan is correct and that the necessary information for determining the correct payments is available.',
    },
  }),

  incomePlan: defineMessages({
    subSectionTitle: {
      id: 'sia.application:income.plan.sub.section.title',
      defaultMessage: 'Tekjuáætlun',
      description: 'Income Plan',
    },
    description: {
      id: 'sia.application:income.plan.description#markdown',
      defaultMessage:
        'Hér setur þú inn þær tekjur sem þú munt hafa árið {incomePlanYear} samhliða greiðslum frá Tryggingastofnun. Til þess að auðvelda skráningu þá sýnum við 5 algengustu tekjutegundir síðustu ára hér fyrir neðan. Hægt er að eyða út tekjutegundum eða breyta þeim eftir því sem við á. Upphæðir sem settar eru inn þurfa að vera fyrir skatt. Athygli er vakin á því að hjá hjónum og sambúðarfólki þarf að setja inn samanlagðar fjármagnstekjur beggja aðila. Mikilvægt er að fjárhæðir í tekjuáætlun endurspegli sem best raunveruleikann, til að tryggja skilvirka  úrvinnslu.',
      description:
        'Below you can enter your proposed income for the year {incomePlanYear} along with payments from the Social Insurance Administration. To simplify the registration process we have provided the top 5 registered income types from the last few years below. You can delete or change income types as needed. Please enter your pre-tax income. Note that couples must supply the combined income for both parties. It is important that the amounts in the income plan reflect reality as best as possible, in order to ensure efficient processing.',
    },
    registerIncome: {
      id: 'sia.application:income.plan.register.income',
      defaultMessage: 'Skráning tekna',
      description: 'Income registration',
    },
    addIncome: {
      id: 'sia.application:income.plan.add.income',
      defaultMessage: 'Bæta við tekjum',
      description: 'Add income',
    },
    saveIncome: {
      id: 'sia.application:income.plan.save.income',
      defaultMessage: 'Skrá tekjur',
      description: 'Save income',
    },
    removeIncome: {
      id: 'sia.application:income.plan.remove.income',
      defaultMessage: 'Eyða tekjum',
      description: 'Remove income',
    },
    editIncome: {
      id: 'sia.application:income.plan.edit.income',
      defaultMessage: 'Breyta tekjum',
      description: 'Edit income',
    },
    incomeCategory: {
      id: 'sia.application:income.plan.income.category',
      defaultMessage: 'Tekjuflokkur',
      description: 'Income category',
    },
    selectIncomeCategory: {
      id: 'sia.application:income.plan.select.income.category',
      defaultMessage: 'Veldu tekjuflokk',
      description: 'Select income category',
    },
    incomeType: {
      id: 'sia.application:income.plan.income.type',
      defaultMessage: 'Tekjutegund',
      description: 'Income type',
    },
    selectIncomeType: {
      id: 'sia.application:income.plan.select.income.type',
      defaultMessage: 'Veldu tekjutegund',
      description: 'Select income type',
    },
    annualIncome: {
      id: 'sia.application:income.plan.annual.income',
      defaultMessage: 'Árstekjur',
      description: 'Annual income',
    },
    monthlyIncome: {
      id: 'sia.application:income.plan.yearly.income',
      defaultMessage: 'Mánaðartekjur',
      description: 'Monthly income',
    },
    incomePerYear: {
      id: 'sia.application:income.plan.income.per.year',
      defaultMessage: 'Tekjur á ári',
      description: 'Income per year',
    },
    foreignIncomePerYear: {
      id: 'sia.application:income.plan.foreign.income.per.year',
      defaultMessage: 'Erlendar tekjur á ári',
      description: 'Foreign income per year',
    },
    equalIncomePerMonth: {
      id: 'sia.application:income.plan.equal.income.per.month',
      defaultMessage: 'Jafnar tekjur á mánuði',
      description: 'Equal income per month',
    },
    equalForeignIncomePerMonth: {
      id: 'sia.application:income.plan.equal.foreign.income.per.month',
      defaultMessage: 'Erlendar tekjur á mánuði',
      description: 'Foreign income per month',
    },
    monthlyDistributionOfIncome: {
      id: 'sia.application:income.plan.monthly.distribution.of.income',
      defaultMessage: 'Óska eftir mánaðarskiptingu atvinnutekna',
      description: 'Request a monthly distribution of salary',
    },
    monthlyDistributionOfIncomeTooltip: {
      id: 'sia.application:income.plan.monthly.distribution.of.income.tooltip',
      defaultMessage:
        'Atvinnutekjur hafa einungis áhrif á lífeyrisgreiðslur þess mánaðar sem atvinnutekna er aflað.',
      description:
        'Income only affects the pension payments for the month in which income is earned.',
    },
    currency: {
      id: 'sia.application:income.plan.currency',
      defaultMessage: 'Gjaldmiðill',
      description: 'Currency',
    },
    selectCurrency: {
      id: 'sia.application:income.plan.select.currency',
      defaultMessage: 'Veldu gjaldmiðil',
      description: 'Select currency',
    },
  }),

  confirm: defineMessages({
    overviewTitle: {
      id: 'sia.application:confirm.overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview',
    },
    overviewDescription: {
      id: 'sia.application:confirm.overview.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
    additionalDocumentsAttachment: {
      id: 'sia.application:confirm.additional.documents.attachment',
      defaultMessage: 'Viðbótargögn til Tryggingastofnunar',
      description:
        'Additional documents for the Social Insurance Administration',
    },
    name: {
      id: 'sia.application:confirm.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'sia.application:confirm.nationalId',
      defaultMessage: 'Kennitala',
      description: 'Icelandic ID number',
    },
    address: {
      id: 'sia.application:confirm.address',
      defaultMessage: 'Heimili',
      description: 'Address',
    },
    municipality: {
      id: 'sia.application:confirm.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    submitButton: {
      id: 'sia.application:confirm.submit.button',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    editButton: {
      id: 'sia.application:confirm.edit.button',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application',
    },
    cancelButton: {
      id: 'sia.application:confirm.cancel.button',
      defaultMessage: 'Hætta við',
      description: 'Cancel',
    },
    personalAllowance: {
      id: 'sia.application:confirm.personal.allowance',
      defaultMessage: 'Persónuafsláttur',
      description: 'Personal tax-free allowance',
    },
    ratio: {
      id: 'sia.application:confirm.ratio',
      defaultMessage: 'Hlutall',
      description: 'Ratio',
    },
  }),

  conclusionScreen: defineMessages({
    section: {
      id: 'sia.application:conclusionScreen.section',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation',
    },
    receivedAwaitingIncomePlanTitle: {
      id: 'sia.application:conclusionScreen.received.awaiting.income.plan.title',
      defaultMessage: 'Umsókn móttekin og bíður tekjuáætlunar',
      description: 'Application received and awaiting income estimate',
    },
    receivedTitle: {
      id: 'sia.application:conclusionScreen.received.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Application received',
    },
    incomePlanAlertMessage: {
      id: 'sia.application:conclusionScreen.income.plan.alert.message',
      defaultMessage:
        'Athugið að ef þú hefur ekki skilað inn tekjuáætlun er mikilvægt að gera það svo hægt sé að afgreiða umsóknina. Þú getur skilað inn tekjuáætlun með því að ýta á takkann hér fyrir neðan.',
      description:
        'Attention, if you have not submitted an income estimate, you must do so for your application to be processed. You can submit an income estimate by pression the button below.',
    },
    alertTitle: {
      id: 'sia.application:conclusionScreen.alert.title',
      defaultMessage: 'Umsókn þín hefur verið móttekin',
      description: 'Your application has been received',
    },
    incomePlanCardLabel: {
      id: 'sia.application:conclusionScreen.income.plan.card.label',
      defaultMessage: 'Skila inn tekjuáætlun',
      description: 'Submit income estimate',
    },
    incomePlanCardText: {
      id: 'sia.application:conclusionScreen.income.plan.card.text',
      defaultMessage:
        'Mikilvægt er að skila inn tekjuáætlun sem fyrst svo hægt sé að afgreiða umsóknina og búa til greiðsluáætlun.',
      description:
        'It is important to submit an income estimate as soon as possible so that the application can be processed and a payment plan can be created.',
    },
  }),
}

export const errorMessages = defineMessages({
  phoneNumber: {
    id: 'sia.application:error.phonenumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'The phone number must be valid.',
  },
  bank: {
    id: 'sia.application:error.bank',
    defaultMessage: 'Ógilt bankanúmer. Þarf að vera á forminu: 0000-11-222222',
    description: 'Invalid bank account. Has to be formatted: 0000-11-222222',
  },
  bankAccountType: {
    id: 'sia.application:error.bankAccountType',
    defaultMessage: 'Nauðsynlegt er að velja tegund reiknings',
    description: 'You must choose a bank account type',
  },
  period: {
    id: 'sia.application:error.period',
    defaultMessage: 'Ógildur mánuður.',
    description: 'Invalid month.',
  },
  iban: {
    id: 'sia.application:error.iban',
    defaultMessage: 'Ógilt IBAN',
    description: 'Invalid IBAN',
  },
  swift: {
    id: 'sia.application:error.swift',
    defaultMessage: 'Ógilt SWIFT',
    description: 'Invalid SWIFT',
  },
  requireAttachment: {
    id: 'sia.application:required.attachment',
    defaultMessage: 'Þú þarft að hlaða upp viðhenginu til að halda áfram.',
    description: 'You must upload an attachment to continue.',
  },
  personalAllowanceUse: {
    id: 'sia.application:personal.allowance.use',
    defaultMessage: 'Nauðsynlegt er að velja hvort nýta skal persónuafslátt',
    description: 'You must choose whether to use your personal allowance',
  },
  personalAllowance: {
    id: 'sia.application:personal.allowance',
    defaultMessage: 'Persónuafsláttur verður að vera milli 1 og 100',
    description: 'Personal tax-free allowance must be between 1 and 100',
  },
  incomePlanMonthsRequired: {
    id: 'sia.application:error.income.plan.months.required',
    defaultMessage: 'Nauðsynlegt er að bæta við tekjum fyrir a.m.k einn mánuð',
    description: 'You must add income for at least one month',
  },
  incomePlanRequired: {
    id: 'sia.application:error.income.plan.required',
    defaultMessage: 'Nauðsynlegt er að bæta við a.m.k einni tekjutegund',
    description: 'You must add at least one income type',
  },
  selfAssessmentQuestionRequired: {
    id: 'sia.application:error.self.assessment.questionnaire.required',
    defaultMessage: 'Þú átt eftir að fylla út í reit á þessari síðu',
    description: 'You have to fill in a field on this page.',
  },
})

export const statesMessages = defineMessages({
  draftDescription: {
    id: 'sia.application:draft.description',
    defaultMessage: 'Þú hefur útbúið drög að umsókn.',
    description: 'You have created a draft application.',
  },
  applicationSent: {
    id: 'sia.application:applicationSent',
    defaultMessage: 'Umsókn send',
    description: 'Application submitted',
  },
  tryggingastofnunSubmittedTitle: {
    id: 'sia.application:tryggingastofnunSubmittedTitle',
    defaultMessage: 'Umsókn hefur verið send til Tryggingastofnunnar',
    description:
      'Application has been sent to the Social Insurance Administration',
  },
  tryggingastofnunSubmittedContent: {
    id: 'sia.application:tryggingastofnunSubmittedContent',
    defaultMessage:
      'Umsóknin þín er í bið eftir yfirferð. Hægt er að breyta umsókn þar til umsókn er komin í yfirferð.',
    description:
      'Your application is awaiting review. It is possible to edit the application until it is under review.',
  },
  tryggingastofnunInReviewTitle: {
    id: 'sia.application:tryggingastofnunInReviewTitle',
    defaultMessage: 'Verið er að fara yfir umsóknina',
    description: 'The application is being reviewed',
  },
  tryggingastofnunInReviewContent: {
    id: 'sia.application:tryggingastofnunInReviewContent',
    defaultMessage:
      'Tryggingastofnun fer nú yfir umsóknina og því getur þetta tekið nokkra daga',
    description:
      'The Social Insurance Administration is currently reviewing the application, this may take a few days',
  },
  applicationEdited: {
    id: 'sia.application:applicationEdited',
    defaultMessage: 'Umsókn breytt',
    description: 'Application edited',
  },
  applicationRejected: {
    id: 'sia.application:applicationRejected',
    defaultMessage: 'Umsókn hafnað',
    description: 'Application rejected',
  },
  applicationDismissed: {
    id: 'sia.application:applicationDismissed',
    defaultMessage: 'Umsókn vísað frá',
    description: 'Application dismissed',
  },
  applicationApproved: {
    id: 'sia.application:applicationApproved',
    defaultMessage: 'Tryggingastofnun hefur samþykkt umsóknina',
    description: 'Tryggingastofnun has accepted the application',
  },
  additionalDocumentRequired: {
    id: 'sia.application:additionalDocumentRequired',
    defaultMessage: 'Viðbótargögn vantar',
    description: 'Additional documents required',
  },
  additionalDocumentsAdded: {
    id: 'sia.application:additionalDocumentsAdded',
    defaultMessage: 'Viðbótargögnum bætt við',
    description: 'Additional documents added',
  },
  additionalDocumentRequiredDescription: {
    id: 'sia.application:additionalDocumentRequired.description',
    defaultMessage: 'Tryggingastofnun vantar frekari gögn vegna umsóknarinnar.',
    description:
      'Social Insurance Administration needs additional documentation regarding your application.',
  },
  pendingTag: {
    id: 'sia.application:pending.tag',
    defaultMessage: 'Í bið',
    description: 'Pending',
  },
  inProgressTag: {
    id: 'sia.application:in.progress.tag',
    defaultMessage: 'Í vinnslu hjá þér',
    description: 'In progress with you',
  },
  dismissedTag: {
    id: 'sia.application:dismissed.tag',
    defaultMessage: 'Vísað frá',
    description: 'Dismissed',
  },
})
