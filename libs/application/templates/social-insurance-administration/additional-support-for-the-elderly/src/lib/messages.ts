import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const additionalSupportForTheElderyFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'asfte.application:applicationTitle',
      defaultMessage: 'Umsókn um félagslegan viðbótarstuðning',
      description: 'Application for additional support for the eldery',
    },
  }),

  pre: defineMessages({
    skraInformationSubTitle: {
      id: 'asfte.application:prerequisites.national.registry.subtitle',
      defaultMessage: 'Upplýsingar um þig og maka. Upplýsingar um búsetu.',
      description:
        'Information about you and spouse. Information about residence.',
    },
    socialInsuranceAdministrationInformationTitle: {
      id: 'asfte.application:prerequisites.socialInsuranceAdministration.title',
      defaultMessage: 'Upplýsingar um tekjur og aðstæður',
      description: 'Information regarding income and circumstances',
    },
    socialInsuranceAdministrationInformationDescription: {
      id: 'asfte.application:prerequisites.socialInsuranceAdministration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikningur eru sóttar á mínar síður hjá Tryggingastofnun. \n\nTryggingastofnun sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðsla mála. Þær upplýsingar geta varðað bæði tekjur og aðrar aðstæður þínar. Ef við á þá hefur Tryggingastofnun heimild að ná í upplýsingar frá öðrum stofnunum. \n\nFrekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar [hér](https://www.tr.is/tryggingastofnun/personuvernd). \n\nEf tekjur eða aðrar aðstæður þínar breytast verður þú að láta Tryggingastofnun vita þar sem það getur haft áhrif á greiðslur þínar.',
      description:
        'Information about email address, phone number and bank account will be retrieved from My Pages at the Social Insurance Administration. \n\nThe Social Insurance Administration only collects the necessary information for processing applications and determining cases. That information can relate to both your income and other circumstances. If applicable, the Social Insurance Administration is authorised to obtain information from other organisations. \n\nMore information on data collection authority and processing of personal information can be found in the privacy policy of the Insurance Administration [here](https://www.tr.is/tryggingastofnun/personuvernd). \n\nIf your income or other circumstances change, you must notify the Social Insurance Administration as this may affect your payments.',
    },
    isNotEligibleLabel: {
      id: 'asfte.application:is.not.eligible.label',
      defaultMessage:
        'Því miður átt þú ekki rétt á félagslegum viðbótarstuðningi',
      description:
        'Unfortunately, you are not entitled to additional support for the elderly',
    },
    isNotEligibleDescription: {
      id: 'asfte.application:is.not.eligible.description#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi\n* Þú hefur ekki náð 67 ára\n* Þú ert ekki með skráð lögheimili á Íslandi\nÞú ert lífeyrisþeki með 90% réttindi eða meira í almannatryggingakerfinu\nEf þú telur þessi atriði ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reasons for this could be the following\n* You are not yet 67 years of age\n* You do not have a registered domicile in Iceland\nYou are a pensioner with 90% or more rights in the social security system\nIf you do not think this apply to you, please contact [tr@tr.is](mailto:tr @tr.is)',
    },
  }),

  info: defineMessages({
    periodDescription: {
      id: 'asfte.application:info.period.description',
      defaultMessage:
        'Veldu tímabil sem þú vilt byrja að fá greiddan félagslegan viðbótastuðning. Hægt er að sækja um fyrir þrjá mánuði aftur í tímann.',
      description: `english translation`,
    },
  }),

  payment: defineMessages({
    personalAllowance: {
      id: 'asfte.application:payment.personal.allowance',
      defaultMessage: 'Vilt þú nýta persónuafsláttinn þinn?',
      description: 'Do you want to use your personal allowance?',
    },
    personalAllowancePercentage: {
      id: 'asfte.application:payment.personal.allowance.percentage',
      defaultMessage: 'Skráðu tölu á bilinu 1-100',
      description: 'Enter a number between 1-100',
    },
    alertSpouseAllowance: {
      id: 'asfte.application:payment.alert.spouse.allowance',
      defaultMessage:
        'Ef þú vilt nýta persónuafslátt maka þíns þá verður makinn þinn að fara inná mínar síður hjá Tryggingastofnun og veita leyfi.',
      description:
        "If you wish to use your spouse's personal discount, your spouse must log into My Pages at the Social Insurance Administration and grant their permission.",
    },
    taxLevel: {
      id: 'asfte.application:payment.tax.level',
      defaultMessage: 'Skattþrep',
      description: 'Tax level',
    },
    taxIncomeLevel: {
      id: 'asfte.application:payment.tax.first.level',
      defaultMessage:
        'Ég vil að staðgreiðslan sé reiknuð út frá tekjuáætlun minni',
      description:
        'I want the withholding tax to be calculated based on my income estimate',
    },
    taxFirstLevel: {
      id: 'asfte.application:payment.tax.second.level',
      defaultMessage:
        'Ég vil að miðað sé við Skattþrep 1 í útreikningum staðgreiðslu (31,45% af tekjum: 0 - 409.986 kr.)',
      description:
        'I want tax level 1 to be taken into account in the withholding calculations (31.45% of income: 0 - 409,986 ISK)',
    },
    taxSecondLevel: {
      id: 'asfte.application:payment.tax.third.level',
      defaultMessage:
        'Ég vil að miðað sé við Skattþrep 2 í útreikningum staðgreiðslu (37,95% af tekjum: 409.986 - 1.151.012 kr.)',
      description:
        'I want tax level 2 to be taken into account in the withholding calculations (37.95% of income: ISK 409,986 - ISK 1,151,012)',
    },
  }),

  fileUpload: defineMessages({
    additionalFileDescription: {
      id: 'asfte.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis dvalarleyfi frá útlendingastofnun (skila þarf inn báðum hliðum dvalarleyfis). Athugaðu að skjalið þarf að vera á .pdf formi.',
      description: 'english description',
    },
  }),

  conclusionScreen: defineMessages({
    bulletList: {
      id: `asfte.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Þú verður að skila inn tekjuáætlun, ef það hefur ekki verið gert nú þegar.\n* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til félagslegs viðbótarstuðnings við aldraða. Vinnslutími umsókna um félagslegan viðbótarstuðning er allt að fjórar vikur.\n* **Þú gætir átt rétt á:**\n\t* Heimilisuppbót`,
      description: `* You must submit an income estimate, if it has not been submitted already.\n* The Social Insurance Administration will review your application and confirm that all information provided is accurate.\n* If required, they will call for additional information/documents.\n* Once all necessary documents have been received, the Social Insurance Administration will review the application and determine whether an additional support for the elderly will be granted. The processing time for additional support for the elderly applications is up to four weeks.\n* **You may be entitled to:**\n\t* Household supplement`,
    },
    nextStepsText: {
      id: 'asfte.application:conclusionScreen.nextStepsText',
      defaultMessage:
        'Hjá Tryggingastofnun verður farið yfir umsóknina. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til félagslegs viðbótarstuðnings við aldraða.',
      description:
        'The application will be reviewed at the Insurance Agency. If needed, additional information/data is requested. Once all the necessary data have been received, a position is taken on the retirement pension.',
    },
  }),

  review: defineMessages({
    personalAllowance: {
      id: 'asfte.application:conformation.personal.allowance',
      defaultMessage: 'Persónuafsláttur',
      description: 'Personal allowance',
    },
    ratio: {
      id: 'asfte.application:conformation.ratio',
      defaultMessage: 'Hlutall',
      description: 'Ratio',
    },
    taxLevel: {
      id: 'asfte.application:conformation.tax.level',
      defaultMessage: 'Skattþrep',
      description: 'Tax level',
    },
  }),
}

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'asfte.application:inReview.form.title',
    defaultMessage: 'Umsókn um félagslegan viðbótarstuðning við aldraða',
    description: 'Application for additional support for the elderly',
  },
})

export const statesMessages = defineMessages({
  applicationRejectedDescription: {
    id: 'asfte.application:applicationRejectedDescription',
    defaultMessage:
      'Umsókn vegna félagsleg viðbótarstuðnings við aldraða hefur verið hafnað',
    description:
      'The application for additional support for the elderly has been rejected',
  },
  applicationApprovedDescription: {
    id: 'asfte.application:applicationApprovedDescription',
    defaultMessage:
      'Umsókn vegna félagsleg viðbótarstuðnings við aldraða hefur verið samþykkt',
    description:
      'The application for additional support for the elderly has been approved',
  },
})
