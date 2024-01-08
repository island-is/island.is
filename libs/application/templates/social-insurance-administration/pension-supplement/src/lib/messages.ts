import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const pensionSupplementFormMessage: MessageDir = {
  shared: defineMessages({
    applicationTitle: {
      id: 'ul.application:applicationTitle',
      defaultMessage: 'Umsókn um uppbót á lífeyri',
      description: 'Application for pension supplement',
    },
  }),

  pre: defineMessages({
    skraInformationSubTitle: {
      id: 'ul.application:skra.info.subtitle',
      defaultMessage: 'Upplýsingar um þig.',
      description: 'Information about you.',
    },
    socialInsuranceAdministrationInformationTitle: {
      id: 'ul.application:prerequisites.socialInsuranceAdministration.title',
      defaultMessage: 'Upplýsingar um tekjur og aðstæður',
      description: 'Information regarding income and circumstances',
    },
    socialInsuranceAdministrationInformationDescription: {
      id: 'ul.application:prerequisites.socialInsuranceAdministration.description#markdown',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikning eru sóttar á mínar síður hjá Tryggingastofnun. \n\nTryggingastofnun sækir einungis nauðsynlegar upplýsingar til úrvinnslu umsókna og afgreiðslu mála. Þær upplýsingar geta varðað bæði tekjur og aðrar aðstæður þínar. Ef við á þá hefur Tryggingastofnun heimild að ná í upplýsingar frá öðrum stofnunum. \n\nFrekari upplýsingar um gagnaöflunarheimild og meðferð persónuupplýsinga má finna í persónuverndarstefnu Tryggingarstofnunar [hér](https://www.tr.is/tryggingastofnun/personuvernd). \n\nEf tekjur eða aðrar aðstæður þínar breytast verður þú að láta Tryggingastofnun vita þar sem það getur haft áhrif á greiðslur þínar.',
      description:
        'Information about email address, phone number and bank account will be retrieved from My Pages at the Social Insurance Administration. \n\nThe Social Insurance Administration only collects the necessary information for processing applications and determining cases. That information can relate to both your income and other circumstances. If applicable, the Social Insurance Administration is authorised to obtain information from other organisations. \n\nMore information on data collection authority and processing of personal information can be found in the privacy policy of the Insurance Administration [here](https://www.tr.is/tryggingastofnun/personuvernd). \n\nIf your income or other circumstances change, you must notify the Social Insurance Administration as this may affect your payments.',
    },
    startApplication: {
      id: 'ul.application:start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
    isNotEligibleLabel: {
      id: 'ul.application:is.not.eligible.label',
      defaultMessage: 'Því miður hefur þú ekki rétt á uppbót á lífeyri',
      description:
        'Unfortunately, you are not entitled to pension supplement',
    },
    isNotEligibleDescription: {
      id: 'ul.application:is.not.eligible.description#markdown',
      defaultMessage:
        'Ástæður fyrir því gætu verið eftirfarandi.\n* Þú ert ekki lífeyrisþegi.\n* Þú ert ekki með lögheimili á Íslandi.\n* Þú ert yfir tekjuviðmiðum.\n\nEf þú telur þessi atriði ekki eiga við um þig, vinsamlegast hafið samband við [tr@tr.is](mailto:tr@tr.is)',
      description:
        'The reasons for this could be the following.\n* You are not a pensioner.\n* You do not have a legal residence in Iceland.\n* Your income is above the income threshold.\n\nIf you do not think these points apply to you, please contact [tr@tr.is](mailto:tr @tr.is)',
    },
  }),

  info: defineMessages({
    periodDescription: {
      id: 'ul.application:info.period.description',
      defaultMessage:
        'Veldu tímabil sem þú vilt byrja að fá greidda uppbót á lífeyri. Hægt er að sækja um fyrir árið í ár og tvö ár aftur í tímann.',
      description: `english translation`,
    },
  }),

  applicationReason: defineMessages({
    title: {
      id: 'ul.application:application.reason.title',
      defaultMessage: 'Ástæða umsóknar',
      description: 'Reason for application',
    },
    description: {
      id: 'ul.application:application.reason.description',
      defaultMessage:
        'Hægt er að merkja við marga möguleika en skylda að merkja við einhvern.',
      description: 'You can check many options, but you must check someone.',
    },
    medicineCost: {
      id: 'ul.application:application.reason.medicine.cost',
      defaultMessage: 'Lyfja- eða sjúkrahjálp',
      description: 'Medicine cost',
    },
    assistedCareAtHome: {
      id: 'ul.application:application.reason.assisted.care.at.home',
      defaultMessage: 'Umönnun í heimahúsi',
      description: 'Assisted care at home',
    },
    houseRent: {
      id: 'ul.application:application.reason.house.rent',
      defaultMessage:
        'Húsaleiga sem fellur utan húsaleigubóta frá sveitarfélagi',
      description:
        'House rent that falls outside the rent allowance from the municipality',
    },
    assistedLiving: {
      id: 'ul.application:application.reason.assisted.living',
      defaultMessage: 'Dvöl á sambýli eða áfangaheimili',
      description: 'Assisted living',
    },
    purchaseOfHearingAids: {
      id: 'ul.application:application.reason.purchase.of.hearing.aids',
      defaultMessage: 'Kaup á heyrnartækjum',
      description: 'Purchase of hearing aids',
    },
    oxygenFilterCost: {
      id: 'ul.application:application.reason.oxygen.filter.cost',
      defaultMessage: 'Rafmagn á súrefnissíu',
      description: 'Oxygen filter voltage/cost',
    },
    halfwayHouse: {
      id: 'ul.application:application.reason.halfway.house',
      defaultMessage: 'Dvöl á áfangaheimili',
      description: 'Halfway house',
    },
  }),

  fileUpload: defineMessages({
    additionalFileDescription: {
      id: 'ul.application:fileUpload.additionalFile.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis staðfestingu frá Þjóðskrá vegna rangar upplýsingar. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit additional data to TR. For example, confirmation from the National Registry due to incorrect information. Note that the document must be in .pdf format.',
    },
    assistedCareAtHomeTitle: {
      id: 'ul.application:fileUppload.assisted.care.at.home.title',
      defaultMessage: 'Fylgiskjöl umönnun í heimahúsi',
      description: 'Pension supplement assisted care at home attachment',
    },
    assistedCareAtHome: {
      id: 'ul.application:fileUppload.assisted.care.at.home',
      defaultMessage:
        'Hér getur þú skilað staðfestingu á kostnaði sem opinberir aðilar greiða ekki. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can upload a confirmation of costs that public entities do not pay. Note that the document must be in .pdf format.',
    },
    houseRentSectionTitle: {
      id: 'ul.application:fileUppload.house.rent.section.title',
      defaultMessage: 'Fylgiskjöl húsaleiga',
      description:
        'Attachments for rent that is not covered by rent allowance from the municipality',
    },
    houseRentTitle: {
      id: 'ul.application:fileUppload.house.rent.title',
      defaultMessage:
        'Fylgiskjöl húsaleiga sem fellur utan húsaleigubóta frá sveitarfélagi',
      description:
        'Attachments for house rent that falls outside the rent allowance from the municipality',
    },
    houseRentAgreement: {
      id: 'ul.application:fileUppload.house.rent.agreement',
      defaultMessage:
        'Hér getur þú skilað húsaleigusamning undirrituðum af leigusala/umboðsmanni og leigutaka. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can return the tenancy agreement signed by the landlord/agent and the tenant. Note that the document must be in .pdf format.',
    },
    houseRentAllowance: {
      id: 'ul.application:fileUppload.house.rent.allowance',
      defaultMessage:
        'Hér getur þú skilað staðfestingu á að ekki sé réttur á húsaleigubótum. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit a confirmation that you are not entitled to rent allowance. Note that the document must be in .pdf format.',
    },
    assistedLivingTitle: {
      id: 'ul.application:fileUppload.assisted.living.title',
      defaultMessage: 'Fylgiskjöl dvöl á sambýli eða áfangaheimili',
      description: 'Attachments assisted living',
    },
    assistedLiving: {
      id: 'ul.application:fileUppload.assisted.living',
      defaultMessage:
        'Hér getur þú skilað undirritaðri staðfestingu á dvöl frá umsjónaraðila/forstöðumanni. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can return a signed confirmation of your stay from the supervisor/director. Note that the document must be in .pdf format.',
    },
    purchaseOfHearingAidsTitle: {
      id: 'ul.application:fileUppload.purchase.of.hearing.aids.title',
      defaultMessage: 'Fylgiskjöl kaup á heyrnartækjum',
      description: 'Attachments purchase of hearing aids',
    },
    purchaseOfHearingAids: {
      id: 'ul.application:fileUppload.purchase.of.hearing.aids',
      defaultMessage:
        'Hér getur þú skilað reikning vegna kaupa á heyrnatækjum innan 4 ára. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can return an invoice for the purchase of hearing aids within 4 years. Note that the document must be in .pdf format.',
    },
    halfwayHouseTitle: {
      id: 'ul.application:fileUppload.halfway.house.title',
      defaultMessage: 'Fylgiskjöl dvöl á áfangaheimili',
      description: 'Attachments halfway house',
    },
    halfwayHouse: {
      id: 'ul.application:fileUppload.halfway.house',
      defaultMessage:
        'Hér getur þú skilað staðfestingu á kostnaði sem opinberir aðilar greiða ekki. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can upload a confirmation of costs that public entities do not pay. Note that the document must be in .pdf format.',
    },
  }),

  conclusionScreen: defineMessages({
    alertTitle: {
      id: 'ul.application:conclusionScreen.alertTitle',
      defaultMessage:
        'Umsókn um uppbót á lífeyri hefur verið send til Tryggingastofnunar',
      description:
        'An application for pension supplements has been sent to Tryggingastofnunar',
    },
    bulletList: {
      id: `ul.application:conclusionScreen.bulletList#markdown`,
      defaultMessage: `* Tryggingastofnun fer yfir umsóknina og staðfestir að allar upplýsingar eru réttar.\n* Ef þörf er á er kallað eftir frekari upplýsingum/gögnum.\n* Þegar öll nauðsynleg gögn hafa borist, fer Tryggingastofnun yfir umsókn og er afstaða tekin til uppbóta á lífeyri.`,
      description: 'BulletList',
    },
    nextStepsText: {
      id: 'ul.application:conclusionScreen.nextStepsText',
      defaultMessage:
        'Tryggingastofnun fer yfir umsóknina. Ef þörf er á er kallað eftir frekari upplýsingum/gögnum. Þegar öll nauðsynleg gögn hafa borist er afstaða tekin til uppbóta á lífeyri.',
      description:
        'The application will be reviewed by the Social Insurance Administration. Additional information/documentation will be requested if needed. Once all necessary documents have been received, it will be determined whether a pension supplement will be granted.',
    },
  }),
}

export const errorMessages = defineMessages({
  applicationReason: {
    id: 'ul.application:error.application.reason',
    defaultMessage: 'Skylda að velja einhverja ástæðu',
    description: 'Required to choose some reason',
  },
})

export const inReviewFormMessages = defineMessages({
  formTitle: {
    id: 'ul.application:inReview.form.title',
    defaultMessage: 'Umsókn um uppbót á lífeyri',
    description: 'Pension supplement',
  },
})

export const statesMessages = defineMessages({
  applicationApprovedDescription: {
    id: 'ul.application:applicationApprovedDescription',
    defaultMessage: 'Umsókn vegna ellilífeyris hefur verið samþykkt',
    description: 'The application for old-age pension has been approved',
  },
})
