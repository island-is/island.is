import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const deathBenefitsFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'db.application:applicationTitle',
      defaultMessage: 'Umsókn um dánarbætur',
      description: 'Application for death benefits',
    },
  }),

  pre: defineMessages({
    registryIcelandDescription: {
      id: 'db.application:registry.iceland.description',
      defaultMessage: 'Upplýsingar um þig, maka og börn.',
      description: 'Information about you, spouse and children.',
    },
    socialInsuranceAdministrationDescription: {
      id: 'db.application:social.insurance.administration.description#markdown',
      defaultMessage:
        'Upplýsingar um bankareikning eru sóttar á Mínar síður hjá Tryggingastofnun. \n\nTryggingastofnun sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðslu mála. Ef við á þá hefur Tryggingastofnun heimild að ná í upplýsingar frá öðrum stofnunum. \n\nFrekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar [hér](https://www.tr.is/tryggingastofnun/personuvernd).',
      description:
        'Information about bank account will be retrieved from My Pages at the Social Insurance Administration. \n\nThe Social Insurance Administration only collects the necessary information for processing applications and determining cases. If applicable, the Social Insurance Administration is authorised to obtain information from other organisations. \n\nMore information on data collection authority and processing of personal information can be found in the privacy policy of the Insurance Administration [here](https://www.tr.is/tryggingastofnun/personuvernd).',
    },
    isNotEligibleTitle: {
      id: 'db.application:is.not.eligible.title',
      defaultMessage: 'Því miður hefur þú ekki rétt á dánarbótum',
      description: 'english translation',
    },
    isNotEligibleDescription: {
      id: 'db.application:is.not.eligible.description#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi.\n* Þú ert ekki með skráð lögheimili á Íslandi.\n* Þú ert 67 ára eða eldri.\n* Þú átt maka sem er lifandi.\n\nEf þú telur þessi atriði ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description: `The reasons for this could be the following.\n* You do not have a registered domicile in Iceland.\n* You are 67 or older.\n* You have a spouse who is alive.\n\nIf you do not think these points apply to you, please contact [tr@tr.is](mailto:tr @tr.is)`,
    },
  }),

  info: defineMessages({
    deceasedSpouseSubSection: {
      id: 'db.application:deceased.spouse.sub.section',
      defaultMessage: 'Látinn maki/sambúðaraðili',
      description: 'english translation',
    },
    deceasedSpouseTitle: {
      id: 'db.application:deceased.spouse.title',
      defaultMessage: 'Upplýsingar um látinn maka/sambúðaraðila',
      description: 'english translation',
    },
    deceasedSpouseDescription: {
      id: 'db.application:deceased.spouse.description',
      defaultMessage:
        'Hérna eru upplýsingar um látinn maka/sambúðaraðila. Athugið ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim í Þjóðskrá.',
      description: 'english translation',
    },
    deceasedSpouseNationalId: {
      id: 'db.application:deceased.spouse.national.id',
      defaultMessage: 'Kennitala',
      description: 'National Id',
    },
    deceasedSpouseDate: {
      id: 'db.application:deceased.spouse.date',
      defaultMessage: 'Dánardagur',
      description: 'Date of death',
    },
    deceasedSpouseName: {
      id: 'db.application:deceased.spouse.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    childrenTitle: {
      id: 'db.application:children.title',
      defaultMessage: 'Barn/börn',
      description: 'Child/children',
    },
    childrenDescription: {
      id: 'db.application:children.description',
      defaultMessage:
        'Samkvæmt uppflettingu í Þjóðskrá ert þú með eftirfarandi barn/börn á framfæri. Dánarbætur eru því framlengdar sjálfkrafa um 12 mánuði til viðbótar án þess að sækja þurfi sérstaklega um það. Greiðslur falla niður þegar barn nær 18 ára aldri.',
      description:
        'According to Registers Iceland you have the below dependent child/children. Therefore, death benefits are automatically extended by 12 months, without the need for any further action. Payments cease when a child has reached the age of 18.',
    },
    expectingChildTitle: {
      id: 'db.application:expectingChild.title',
      defaultMessage: 'Áttu von á barni',
      description: 'Are you expecting a child?',
    },
    expectingChildDescription: {
      id: 'db.application:expectingChild.description',
      defaultMessage:
        'Fólk í skráðri sambúð, sem ekki hefur varið í 1 ár, getur átt rétt á dánarbótum hafi það átt barn saman eða ef umsækjandi er barnshafandi.',
      description:
        'Individuals in registered cohabition, which has lasted for less than 1 year, may be entitled to death benefits if they share a child or if the applicant is pregnant.',
    },
    expectingChildFileUpload: {
      id: 'db.application:expectingChild.fileUpload',
      defaultMessage: 'Fylgiskjöl vegna væntanlegs barns',
      description: 'File upload for expected child',
    },
    expectingChildFileUploadDescription: {
      id: 'db.application:expectingChild.fileUpload.description',
      defaultMessage:
        'Hér þarft þú að skila inn staðfestingu á því að þú eigir von á barni.',
      description:
        'Below you must submit confirmation that you are expecting a child.',
    },
  }),

  payment: defineMessages({
    spouseAllowance: {
      id: 'db.application:payment.spouse.allowance',
      defaultMessage: 'Viltu nýta persónuafslátt látins maka/sambúðaraðila?',
      description:
        "Would you like to use your deceased spouse's personal tax-free allowance?",
    },
    spouseAllowanceDescription: {
      id: 'db.application:payment.spouse.allowance.description',
      defaultMessage:
        'Þú getur nýtt þér skattkort maka/sambúðaraðila í átta mánuði eftir andlát hans',
      description:
        "You can use your spouse's personal tax-free allowance for eight months after their passing",
    },
    spouseAllowancePercentage: {
      id: 'db.application:payment.spouse.allowance.percentage',
      defaultMessage: 'Skráðu tölu á bilinu 1-100',
      description: 'Enter a number between 1 and 100',
    },
  }),

  confirm: defineMessages({
    spouseAllowance: {
      id: 'db.application:confirm.spouse.allowance',
      defaultMessage: 'Persónuafsláttur maka',
      description: "Spouse's personal tax-free allowance",
    },
    expectingChildAttachment: {
      id: 'db.application:confirm.expecting.child.attachment',
      defaultMessage: 'Fylgiskjöl vegna væntanlegs barns',
      description: 'Expected child attachments',
    },
    deathCertificateAttachment: {
      id: 'db.application:confirm.death.certificate.attachment',
      defaultMessage: 'Fylgiskjöl dánarvottorð',
      description: 'Death certificate attachments',
    },
  }),

  conclusionScreen: defineMessages({
    alertMessage: {
      id: 'db.application:conclusionScreen.alertMessage',
      defaultMessage:
        'Umsókn um dánarbætur hefur verið send til Tryggingastofnunar',
      description:
        'Application for death benefits has been sent to the Social Insurance Administration',
    },
    bulletList: {
      id: `db.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til dánarbóta.\n\n\n **Þú gætir átt rétt á:**\n* Barnalífeyri\n* Mæðra- og feðralaun`,
      description:
        '* The Social Insurance Administration will review your application and confirm that all information provided is accurate.\n* If required, they will call for additional information/documents.\n* Once all necessary documents have been received, the Social Insurance Administration will review the application and determine whether a death benefit will be granted.\n\n\n **You may be entitled to:**\n* Child pension\n* Single Parent Allowance',
    },
    nextStepsText: {
      id: 'db.application:conclusionScreen.nextStepsText',
      defaultMessage:
        'Tryggingastofnun fer yfir umsóknina. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til dánarbóta.',
      description:
        'The application will be reviewed by the Social Insurance Administration. Additional information/documentation will be requested if needed. Once all necessary documents have been received, it will be determined whether a death benefit will be granted.',
    },
  }),
}

export const statesMessages = defineMessages({
  applicationRejectedDescription: {
    id: 'db.application:applicationRejectedDescription',
    defaultMessage: 'Umsókn vegna dánarbóta hefur verið hafnað',
    description: 'The application for death benefits has been rejected',
  },
  applicationApprovedDescription: {
    id: 'db.application:applicationApprovedDescription',
    defaultMessage: 'Umsókn vegna dánarbóta hefur verið samþykkt',
    description: 'The application for death benefits has been approved',
  },
  deathBenefitsDismissed: {
    id: 'db.application:application.dismissed',
    defaultMessage:
      'Tryggingastofnun hefur vísað umsókn þinni um dánarbætur frá',
    description:
      'Tryggingastofnun has dismissed your death benefits application',
  },
  deathBenefitsDismissedDescription: {
    id: 'db.application:application.dismissed.description',
    defaultMessage: 'Umsókn þinni um dánarbætur hefur verið vísað frá',
    description: 'Your death benefits application has been dimissed',
  },
})
