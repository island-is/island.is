import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const householdSupplementFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'hs.application:application.title',
      defaultMessage: 'Umsókn um heimilisuppbót',
      description: 'Application for household supplement',
    },
    householdSupplement: {
      id: 'hs.application:household.supplement',
      defaultMessage: 'Heimilisuppbót',
      description: 'Household supplement',
    },
  }),

  pre: defineMessages({
    skraInformationSubTitle: {
      id: 'hs.application:skra.info.subtitle',
      defaultMessage:
        'Upplýsingar um þig og maka. Upplýsingar um lögheimilistengsl.',
      description:
        'Information about you and spouse. Information about cohabitants.',
    },
    socialInsuranceAdministrationInformationTitle: {
      id: 'hs.application:prerequisites.socialInsuranceAdministration.title',
      defaultMessage: 'Upplýsingar af mínum síðum hjá Tryggingastofnun',
      description: 'english translation',
    },
    socialInsuranceAdministrationInformationDescription: {
      id: 'hs.application:prerequisites.socialInsuranceAdministration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikning eru sóttar á mínar síður hjá Tryggingastofnun. \n\nTryggingastofnun sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðslu mála. Ef við á þá hefur Tryggingastofnun heimild að ná í upplýsingar frá öðrum stofnunum. \n\nFrekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar [hér](https://www.tr.is/tryggingastofnun/personuvernd).',
      description:
        'Information about email address, phone number and bank account will be retrieved from My Pages at the Social Insurance Administration. \n\nThe Social Insurance Administration only collects the necessary information for processing applications and determining cases. If applicable, the Social Insurance Administration is authorised to obtain information from other organisations. \n\nMore information on data collection authority and processing of personal information can be found in the privacy policy of the Insurance Administration [here](https://www.tr.is/tryggingastofnun/personuvernd).',
    },
    isNotEligibleLabel: {
      id: 'hs.application:is.not.eligible.label',
      defaultMessage: 'Því miður hefur þú ekki rétt á heimilisuppbót',
      description:
        'Unfortunately, you are not entitled to household supplement',
    },
    isNotEligibleDescription: {
      id: 'hs.application:is.not.eligible.description#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi.\n* Þú ert ekki lífeyrisþegi.\n* Maki þinn delur ekki á stofnun fyrir aldraða.\n\nEf þú telur þessi atriði ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reasons for this could be the following.\n* You are not a pensioner.\n* Your spouse does not belong to an institution for the elderly.\n\nIf you do not think these points apply to you, please contact [tr@tr.is](mailto:tr @tr.is)',
    },
  }),

  info: defineMessages({
    householdSupplementDescription: {
      id: 'hs.application:info.household.supplement.description#markdown',
      defaultMessage:
        'Til að eiga rétt á heimilisuppbót verður umsækjandi að vera einhleypur og búa einn. Einnig er heimilt að greiða heimilisuppbót til lífeyrisþega ef maki dvelur á stofnun fyrir aldraða. Tvær undantekningar eru á þessu: býr með barni/börnum yngri en 18 ára eða 18-25 ára ungmenni/um  sem er í námi eða ef ungmenni yngra en 25 ára er með tímabundið aðsetur fjarri lögheimili vegna náms.',
      description: 'english translation',
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
    periodDescription: {
      id: 'hs.application:info.period.description',
      defaultMessage:
        'Veldu tímabil sem þú vilt byrja að fá greidda heimilisuppbót. Hægt er að sækja fyrir árið í ár og 2 ár aftur í tímann.',
      description: `english translation`,
    },
  }),

  fileUpload: defineMessages({
    schoolConfirmationTitle: {
      id: 'hs.application:fileUppload.school.confirmation.title',
      defaultMessage: 'Fylgiskjöl skólavottorð',
      description: "Household supplement young person's school attendance",
    },
    schoolConfirmation: {
      id: 'hs.application:fileUppload.school.confirmation',
      defaultMessage: 'Hér þarft þú að skila vottorði um skólavist ungmennis.',
      description:
        "Here you must upload a certificate of a young person's school attendance.",
    },
  }),

  confirm: defineMessages({
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
  }),

  conclusionScreen: defineMessages({
    alertMessage: {
      id: 'hs.application:conclusionScreen.alertMessage',
      defaultMessage:
        'Umsókn um heimilisuppbót hefur verið send til Tryggingastofnunar',
      description:
        'An application for household supplements has been sent to Tryggingastofnunar',
    },
    bulletList: {
      id: `hs.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til heimilisuppbótar.`,
      description: 'BulletList',
    },
    nextStepsText: {
      id: 'hs.application:conclusionScreen.nextStepsText',
      defaultMessage:
        'Hjá Tryggingastofnun verður farið yfir umsóknina. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til ellilífeyris.',
      description:
        'The application will be reviewed at the Insurance Agency. If needed, additional information/data is requested. Once all the necessary data have been received, a position is taken on the retirement pension.',
    },
  }),
}

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'hs.application:inReview.form.title',
    defaultMessage: 'Umsókn um heimilisuppbót',
    description: 'Household supplement',
  },
})

export const statesMessages = defineMessages({
  applicationApprovedDescription: {
    id: 'hs.application:applicationApprovedDescription',
    defaultMessage: 'Umsókn um heimilisuppbót hefur verið samþykkt',
    description: 'The application for household supplement has been approved',
  },
  householdSupplementDismissed: {
    id: 'hs.application:application.dismissed',
    defaultMessage:
      'Tryggingastofnun hefur vísað umsókn þinni um heimilisuppbót frá',
    description:
      'Tryggingastofnun has dismissed your household supplement application',
  },
  householdSupplementDismissedDescription: {
    id: 'hs.application:application.dismissed.description',
    defaultMessage: 'Umsókn þinni um heimilisuppbót hefur verið vísað frá',
    description: 'Your household supplement application has been dimissed',
  },
})
