import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const additionalSupportForTheElderyFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'asfte.application:applicationTitle',
      defaultMessage: 'Umsókn um félagslegan viðbótarstuðning við aldraða',
      description: 'Application for additional support for the eldery',
    },
  }),

  pre: defineMessages({
    skraInformationSubTitle: {
      id: 'asfte.application:prerequisites.national.registry.subtitle',
      defaultMessage: 'Upplýsingar um þig.',
      description: 'Information about you.',
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
    instructionsShortTitle: {
      id: 'asfte.application:info.instructions.shortTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Information',
    },
    instructionsTitle: {
      id: 'asfte.application:info.instructions.title',
      defaultMessage: 'Upplýsingar til umsækjanda',
      description: 'Information for applicant',
    },
    instructionsDescription: {
      id: 'asfte.application:info.instructions.description#markdown',
      defaultMessage:
        '* Það sem þú þarft að gera til þess að þessi umsókn taki gildi: Mæta í þjónustumiðstöð/umboð og framvísa gildu persónuskilríki (ökuskírteini, nafnskírteini eða vegabréf) innan við 30 daga frá því að þú sendir inn þessa umsókn.\n* Það sem þú þarft að gera til þess að viðhalda réttinum til félagslegs viðbótarstuðnings: Mæta árlega í þjónustumiðstöð/umboð og framvísa gildu persónuskilríki (ökuskírteini, nafnskírteini eða vegabréf).\n* Til að halda áfram og ljúka umsókninni þarftu að merkja við að þú hafir lesið og skilið þessa skilmála.',
      description: 'Information on conditions regarding asfte application',
    },
    instructionsCheckbox: {
      id: 'asfte.application:info.instructions.checkbox',
      defaultMessage: 'Ég staðfesti að ég hef lesið ofangreindar upplýsingar.',
      description: 'I confirm that I have read the above information.',
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
}

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
  asfteDismissed: {
    id: 'asfte.application:application.dismissed',
    defaultMessage:
      'Tryggingastofnun hefur vísað umsókn þinni um félagslegan viðbótarstuðning frá',
    description:
      'Tryggingastofnun has dismissed your additional support for the elderly application',
  },
  asfteDismissedDescription: {
    id: 'asfte.application:application.dismissed.description',
    defaultMessage:
      'Umsókn þinni um félagslegan viðbótarstuðning hefur verið vísað frá',
    description:
      'Your additional support for the elderly application has been dimissed',
  },
})
