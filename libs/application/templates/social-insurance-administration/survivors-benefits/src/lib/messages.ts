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
      description: 'Information about you, spouse and children.',
    },
    socialInsuranceAdministrationTitle: {
      id: 'sb.application:social.insurance.administration.title',
      defaultMessage: 'Upplýsingar af mínum síðum hjá Tryggingastofnun',
      description:
        'Information from My pages at the Social Insurance Administration',
    },
    socialInsuranceAdministrationDescription: {
      id: 'sb.application:social.insurance.administration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikning eru sóttar á mínar síður hjá Tryggingastofnun. \n\nTryggingastofnun sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðslu mála. Ef við á þá hefur Tryggingastofnun heimild að ná í upplýsingar frá öðrum stofnunum. \n\nFrekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar [hér](https://www.tr.is/tryggingastofnun/personuvernd).',
      description:
        'Information about email address, phone number and bank account will be retrieved from My Pages at the Social Insurance Administration. \n\nThe Social Insurance Administration only collects the necessary information for processing applications and determining cases. If applicable, the Social Insurance Administration is authorised to obtain information from other organisations. \n\nMore information on data collection authority and processing of personal information can be found in the privacy policy of the Insurance Administration [here](https://www.tr.is/tryggingastofnun/personuvernd).',
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
    childrenTitle: {
      id: 'sb.application:children.title',
      defaultMessage: 'Barn/börn',
      description: 'Child/children',
    },
    childrenDescription: {
      id: 'sb.application:children.description',
      defaultMessage:
        'Samkvæmt uppflettingu í Þjóðskrá ert þú með eftirfarandi barn/börn skráð á lögheimili hjá þér.',
      description: 'english translation',
    },
    expectingChildTitle: {
      id: 'sb.application:expectingChild.title',
      defaultMessage:
        'Áttu von á barni',
      description: 'Are you expecting a child?',
    },
    expectingChildFileUpload: {
      id: 'sb.application:expectingChild.fileUpload',
      defaultMessage:
        'Fylgiskjöl vegna væntanlegs barns',
      description: 'File upload for expected child',
    },
    expectingChildFileUploadDescription: {
      id: 'sb.application:expectingChild.fileUpload.description',
      defaultMessage:
        'Hér þarft þú að skila inn staðfestingu á því að þú eigir von á barni.',
      description: 'Below you must submit confirmation that you are expecting a child.',
    },
  }),

  payment: defineMessages({
    spouseAllowance: {
      id: 'sb.application:payment.spouse.allowance',
      defaultMessage: 'Viltu nýta persónuafslátt látins maka/sambúðaraðila?',
      description: 'Would you like to use your deceased spouse\'s personal tax-free allowance?',
    },
    spouseAllowanceDescription: {
      id: 'sb.application:payment.spouse.allowance.description',
      defaultMessage: 'Þú getur nýtt þér skattkort maka/sambúðaraðila í átta mánuði eftir andlát hans',
      description: 'You can use your spouse\'s personal tax-free allowance for eight months after their passing',
    },
    spouseAllowancePercentage: {
      id: 'sb.application:payment.spouse.allowance.percentage',
      defaultMessage: 'Skráðu tölu á bilinu 1-100',
      description: 'Enter a number between 1 and 100',
    },
  }),

  confirm: defineMessages ({
    spouseAllowance: {
      id: 'sb.application:confirm.spouse.allowance',
      defaultMessage: 'Persónuafsláttur maka',
      description: 'Spouse\'s personal tax-free allowance',
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
