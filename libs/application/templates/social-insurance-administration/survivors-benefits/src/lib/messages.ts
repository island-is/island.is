import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const survivorsBenefitsFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'sb.application:applicationTitle',
      defaultMessage: 'Umsókn um dánarbætur',
      description: 'Application for survivors benefits',
    },
  }),

  pre: defineMessages({
    registryIcelandDescription: {
      id: 'sb.application:registry.iceland.description',
      defaultMessage: 'Upplýsingar um þig, maka og börn.',
      description: 'english translation',
    },
    socialInsuranceAdministrationTitle: {
      id: 'sb.application:social.insurance.administration.title',
      defaultMessage: 'Upplýsingar af mínum síðum hjá Tryggingastofnun',
      description: 'english translation',
    },
    socialInsuranceAdministrationDescription: {
      id: 'sb.application:social.insurance.administration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikningur eru sóttar á mínar síður hjá Tryggingastofnun. TR sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðsla mála. Frekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar, [https://www.tr.is/tryggingastofnun/personuvernd](https://www.tr.is/tryggingastofnun/personuvernd).',
      description: 'english translation',
    },
  }),

  info: defineMessages({
    deceasedSpouseSubSection: {
      id: 'sb.application:deceased.spouse.sub.section',
      defaultMessage: 'Látinn maki/sambúðaraðili',
      description: 'english translation',
    },
    deceasedSpouseTitle: {
      id: 'sb.application:deceased.spouse.title',
      defaultMessage: 'Upplýsingar um látinn maka/sambúðaraðila',
      description: 'english translation',
    },
    deceasedSpouseDescription: {
      id: 'sb.application:deceased.spouse.description',
      defaultMessage:
        'Hérna eru upplýsingar um látinn maka/sambúðaraðila. Athugið ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim í Þjóðskrá.',
      description: 'english translation',
    },
    deceasedSpouseName: {
      id: 'sb.application:deceased.spouse.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
  }),

  fileUpload: defineMessages({
    additionalFileDescription: {
      id: 'sb.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis staðfestingu frá Þjóðskrá vegna rangra upplýsinga. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit additional data to TR. For example, confirmation from the National Registry due to incorrect information. Note that the document must be in .pdf format.',
    },
  }),

  conclusionScreen: defineMessages({
    alertMessage: {
      id: 'sb.application:conclusionScreen.alertMessage',
      defaultMessage:
        'Umsókn um dánarbætur hefur verið send til Tryggingastofnunar',
      description:
        'Application for survivors benefits has been sent to the Social Insurance Administration',
    },
    bulletList: {
      id: `sb.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til dánarbóta.\n\n\n **Þú gætir átt rétt á:**\n* Barnalífeyri\n* Mæðra- og feðralaun`,
      description:
        '* The Social Insurance Administration will review your application and confirm that all information provided is accurate.\n* If required, they will call for additional information/documents.\n* Once all necessary documents have been received, the Social Insurance Administration will review the application and determine whether a survivors benefit will be granted.\n\n\n **You may be entitled to:**\n* Child pension\n* Single Parent Allowance',
    },
    nextStepsText: {
      id: 'sb.application:conclusionScreen.nextStepsText',
      defaultMessage:
        'Tryggingastofnun fer yfir umsóknina. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til dánarbóta.',
      description:
        'The application will be reviewed by the Social Insurance Administration. Additional information/documentation will be requested if needed. Once all necessary documents have been received, it will be determined whether a survivors benefit will be granted.',
    },
  }),
}

export const statesMessages = defineMessages({
  applicationRejectedDescription: {
    id: 'sb.application:applicationRejectedDescription',
    defaultMessage: 'Umsókn vegna dánarbóta hefur verið hafnað',
    description: 'The application for survivors benefits has been rejected',
  },
  applicationApprovedDescription: {
    id: 'sb.application:applicationApprovedDescription',
    defaultMessage: 'Umsókn vegna dánarbóta hefur verið samþykkt',
    description: 'The application for survivors benefits has been approved',
  },
})
