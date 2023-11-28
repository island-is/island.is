import { defineMessages } from 'react-intl'

export const review = {
  general: defineMessages({
    title: {
      id: 'aosh.application:review.general.title',
      defaultMessage: 'Yfirlit eigendaskipta',
      description: 'Title of overview screen',
    },
    sectionTitle: {
      id: 'aosh.application:review.general.sectionTitle',
      defaultMessage: 'Til samþykktar',
      description: 'Title of overview screen',
    },
    description: {
      id: 'aosh.application:review.general.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp.',
      description: 'Description of overview screen',
    },
    approvedSectionTitle: {
      id: 'aosh.application:review.general.approvedSectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Approved section title of overview screen',
    },
  }),
  status: defineMessages({
    title: {
      id: 'aosh.application:review.status.title',
      defaultMessage: 'Staða tilkynningar',
      description: 'Title in status part of review process',
    },
    description: {
      id: 'aosh.application:review.status.description',
      defaultMessage: 'Hér að neðan kemur fram hvað gerist næst',
      description: 'Description in status part of review process',
    },
    viewOverview: {
      id: 'aosh.application:review.status.viewOverview',
      defaultMessage: 'Skoða yfirlit',
      description: 'View overview label in status part of review process',
    },
    openAgreement: {
      id: 'aosh.application:review.status.openAgreement',
      defaultMessage: 'Opna samþykki',
      description: 'Open agreement label in status part of review process',
    },
    youLabel: {
      id: 'aosh.application:review.status.youLabel',
      defaultMessage: 'þú',
      description: 'You label in status part of review process',
    },
  }),
  step: {
    tagText: defineMessages({
      received: {
        id: 'aosh.application:review.step.tagText.received',
        defaultMessage: 'Móttekin',
        description: 'Received tag text in status step part of review process',
      },
      pendingApproval: {
        id: 'aosh.application:review.step.tagText.pendingApproval',
        defaultMessage: 'Samþykki í bið',
        description:
          'Pending approval tag text in status step part of review process',
      },
    }),
    title: defineMessages({
      transferOfVehicle: {
        id: 'aosh.application:review.step.title.transferOfVehicle',
        defaultMessage: 'Skráning eigendaskipta á tæki {variable}',
        description:
          'Transfer of vehicle title in status step part of review process',
      },
      payment: {
        id: 'aosh.application:review.step.title.payment',
        defaultMessage: 'Greiðsla móttekin',
        description: 'Payment title in status step part of review process',
      },
      buyer: {
        id: 'aosh.application:review.step.title.buyer',
        defaultMessage: 'Samþykki kaupanda',
        description: 'Buyer title in status step part of review process',
      },
      buyerOperator: {
        id: 'aosh.application:review.step.title.buyerOperator',
        defaultMessage: 'Samþykki umráðarmanns kaupanda',
        description:
          'Buyer operator title in status step part of review process',
      },
    }),
    description: defineMessages({
      transferOfVehicle: {
        id: 'aosh.application:review.step.description.transferOfVehicle',
        defaultMessage:
          'Tilkynning um eigendaskiptu hefur borist Vinnueftirlitinu',
        description:
          'Transfer of vehicle description in status step part of review process',
      },
      payment: {
        id: 'aosh.application:review.step.description.payment',
        defaultMessage: 'Greitt hefur verið fyrir eigendaskiptin af seljanda',
        description:
          'Payment description in status step part of review process',
      },
      buyer: {
        id: 'aosh.application:review.step.description.buyer',
        defaultMessage:
          'Beðið er eftir að nýr eigandi staðfesti eigendaskiptin',
        description: 'Buyer description in status step part of review process',
      },
      buyerOperator: {
        id: 'aosh.application:review.step.description.buyerOperator',
        defaultMessage:
          'Beðið er eftir að umráðamaður/menn kaupanda staðfesti eigendaskiptin',
        description:
          'Buyer operator description in status step part of review process',
      },
    }),
  },
  buttons: defineMessages({
    back: {
      id: 'aosh.application:review.buttons.back',
      defaultMessage: 'Til baka',
      description: 'Back button in review process',
    },
    reject: {
      id: 'aosh.application:review.buttons.reject',
      defaultMessage: 'Hafna',
      description: 'Reject button in review process',
    },
    approve: {
      id: 'aosh.application:review.buttons.approve',
      defaultMessage: `Samþykkja`,
      description: 'Approve button in review process',
    },
  }),
}
