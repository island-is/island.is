import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const oldAgePensionFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'oap.application:applicationTitle',
      defaultMessage: 'Umsókn um ellilífeyri',
      description: 'Application for old-age pension',
    },
  }),

  pre: defineMessages({
    prerequisitesSection: {
      id: 'oap.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataDescription: {
      id: 'oap.application:externalData.description',
      defaultMessage:
        'Eftirfarandi upplýsingar verða sóttar rafrænt þar sem hægt er',
      description:
        'The following information will be retrieved electronically where possible',
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
      id: 'oap.application:pension.fund.question.description#markdown',
      defaultMessage:
        'Til að geta sótt um ellilífeyri þarf að vera búið að sækja um í öllum lífeyrissjóðum sem umsækjandi á rétt í. Hægt er að nálgast yfirlit yfir þá á Mínum síðum síðum þeirra sjóða sem þú hefur greitt í. Yfirlitið er oft kallað lífeyrisgátt eða réttindagátt. Nánari upplýsingar er að finna á https://www.lifeyrismal.is/is/lifeyrisgattin',
      description:
        'To be eligible for a pension, you must have applied to all the pension funds to which you are entitled. An overview of these can be found on the My Pages page of the funds you have paid into. The overview is often called a pension portal or rights portal. More information can be found here.',
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
    isNotEligibleHalfLabel: {
      id: 'oap.application:is.not.eligible.half.label',
      defaultMessage: 'Því miður hefur þú ekki rétt á hálfum ellilífeyri',
      description:
        'Unfortunately, you are not entitled to half old-age pension',
    },
    isNotEligibleSailorLabel: {
      id: 'oap.application:is.not.eligible.sailor.label',
      defaultMessage: 'Því miður hefur þú ekki rétt á ellilífeyri sjómanna',
      description: "Unfortunately, you are not entitled to fisherman's pension",
    },
    isNotEligibleDescription: {
      id: 'oap.application:is.not.eligible.description#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi:\n* Þú ert ellilífeyrisþegi.\n* Þú ert með umsókn um ellilífeyri í vinnslu.\n* Þú ert yngri en 65 ára.\n\nEf þú telur þessi atriði ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reasons for this could be the following:\n* You are already receiving an old-age pension.\n* You have an application for old-age pension in progress.\n* You are younger than 65 years old.\n\nIf you do not think these points apply to you, please contact [tr@tr.is](mailto:tr @tr.is)',
    },
    isNotEligibleHalfDescription: {
      id: 'oap.application:is.not.eligible.half.description#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi:\n* Þú ert hálfur ellilífeyrisþegi.\n* Þú ert með umsókn um hálfan ellilífeyri í vinnslu.\n* Þú ert yngri en 65 ára.\n\nEf þú telur þessi atriði ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reasons for this could be the following:\n* You are already receiving an half old-age pension.\n* You have an application for half old-age pension in progress.\n* You are younger than 65 years old.\n\nIf you do not think these points apply to you, please contact [tr@tr.is](mailto:tr @tr.is)',
    },
    isNotEligibleSailorDescription: {
      id: 'oap.application:is.not.eligible.sailor.description#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi:\n* Þú ert ellilífeyrisþegi sjómanna.\n* Þú ert með umsókn um ellilífeyri sjómanna í vinnslu.\n* Þú ert yngri en 60 ára.\n\nEf þú telur þessi atriði ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        "The reasons for this could be the following:\n* You are already receiving an fisherman's pension.\n* You have an application for fisherman's pension in progress.\n* You are younger than 60 years old.\n\nIf you do not think these points apply to you, please contact [tr@tr.is](mailto:tr @tr.is)",
    },
  }),

  onePaymentPerYear: defineMessages({
    onePaymentPerYearTitle: {
      id: 'oap.application:one.payment.per.year.title',
      defaultMessage: 'Vilt þú fá greiddan lífeyri einu sinni á ári?',
      description: 'One payment per year',
    },
    onePaymentPerYearDescription: {
      id: 'oap.application:one.payment.per.year.description#markdown',
      defaultMessage:
        'Ef svo er þá reiknum við réttindin út þegar staðfest skattframtal liggur fyrir og eru greidd út í einu lagi. Ath með því að fá greitt einu sinni á ári fær viðkomandi nákvæmlega það sem hann á rétt á og losnar til dæmis við að fá á sig kröfu við uppgjör vegna ofgreiddra greiðslnna. Reynist inneign vera til staðar verður hún greidd með eingreiðslu þann 1. júní.',
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
      id: 'oap.application:residence.history.description#markdown',
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
    fishermen: {
      id: 'oap.application:review.fishermen',
      defaultMessage: 'Ellilífeyri sjómanna',
      description: `Fishermen`,
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
  }),

  period: defineMessages({
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
      id: 'oap.application:conclusionScreen.expandableDescriptionField.title',
      defaultMessage: 'Hvað gerist næst?',
      description: 'What happens next',
    },
    alertMessage: {
      id: 'oap.application:conclusionScreen.alertMessage',
      defaultMessage:
        'Umsókn um ellilífeyri hefur verið send til Tryggingastofnunar',
      description:
        'An application for old age pension has been sent to the Social Insurance Administration',
    },
    bulletList: {
      id: `oap.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Þú verður að skila inn tekjuáætlun, ef ekki búið nú þegar.\n* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til elllífeyris. Vinnslutími umsókna um ellilífeyri er fjórar til sex vikur.\n* **Þú gætir átt rétt á:**\n\t* Heimilisuppbót\n\t* Barnalífeyri\n\t* Uppbót á lífeyri\n\t* Ellilífeyri vegna EES.`,
      description: 'BulletList',
    },
    nextStepsText: {
      id: 'oap.application:conclusionScreen.nextStepsText',
      defaultMessage:
        'Hjá Tryggingastofnun verður farið yfir umsóknina. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til ellilífeyris.',
      description:
        'The application will be reviewed at the Insurance Agency. If needed, additional information/data is requested. Once all the necessary data have been received, a position is taken on the retirement pension.',
    },
  }),

  fileUpload: defineMessages({
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
    addEmployer: {
      id: 'oap.application:employer.add',
      defaultMessage: 'Bæta við vinnuveitanda',
      description: 'Add an employer',
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

export const validatorErrorMessages = defineMessages({
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
  totalEmployersRatioMoreThan50: {
    id: 'oap.application:total.employers.ratio.more.than.50',
    defaultMessage: 'Summa starfshlutfalls má ekki vera meira en 50%',
    description: 'Sumary of Employment rate must be less than or equal 50%',
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
})

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'oap.application:inReview.form.title',
    defaultMessage: 'Umsókn vegna ellilífeyris',
    description: 'Old age pension',
  },
})

export const statesMessages = defineMessages({
  applicationRejectedDescription: {
    id: 'oap.application:applicationRejectedDescription',
    defaultMessage: 'Umsókn vegna ellilífeyris hefur verið hafnað',
    description: 'The application for old-age pension has been rejected',
  },
  applicationApprovedDescription: {
    id: 'oap.application:applicationApprovedDescription',
    defaultMessage: 'Umsókn vegna ellilífeyris hefur verið samþykkt',
    description: 'The application for old-age pension has been approved',
  },
  oldAgePensionSubmittedContent: {
    id: 'oap.application:oldAgePensionSubmittedContent#markdown',
    defaultMessage:
      'Umsókn þín er í bið eftir yfirferð. Hægt er að breyta umsókn þar til hún er tekin til yfirferðar. Athugið að ef ekki er búið að skila inn tekjuáætlun þarf að gera það hér.',
    description:
      'Your application is awaiting review. It is possible to edit the application until it is under review. Please note that if you have not submitted an income plan, you must do so here.',
  },
  oldAgePensionDismissed: {
    id: 'oap.application:application.dismissed',
    defaultMessage:
      'Tryggingastofnun hefur vísað umsókn þinni um ellilífeyri frá',
    description:
      'Tryggingastofnun has dismissed your old age pension application',
  },
  oldAgePensionDismissedDescription: {
    id: 'oap.application:application.dismissed.description',
    defaultMessage: 'Umsókn þinni um ellilífeyri hefur verið vísað frá',
    description: 'Your old age pension application has been dimissed',
  },
})
