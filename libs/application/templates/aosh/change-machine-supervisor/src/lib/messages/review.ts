import { defineMessages } from 'react-intl'

export const review = {
  status: defineMessages({
    title: {
      id: 'aosh.cms.application:review.status.title',
      defaultMessage: 'Staða tilkynningar',
      description: 'Title in status part of review process',
    },
    description: {
      id: 'aosh.cms.application:review.status.description',
      defaultMessage: 'Hér að neðan kemur fram hvað gerist næst',
      description: 'Description in status part of review process',
    },
    viewOverview: {
      id: 'aosh.cms.application:review.status.viewOverview',
      defaultMessage: 'Skoða yfirlit',
      description: 'View overview label in status part of review process',
    },
    openAgreement: {
      id: 'aosh.cms.application:review.status.openAgreement',
      defaultMessage: 'Opna samþykki',
      description: 'Open agreement label in status part of review process',
    },
    youLabel: {
      id: 'aosh.cms.application:review.status.youLabel',
      defaultMessage: 'þú',
      description: 'You label in status part of review process',
    },
  }),
  step: {
    tagText: defineMessages({
      received: {
        id: 'aosh.cms.application:review.step.tagText.received',
        defaultMessage: 'Móttekin',
        description: 'Received tag text in status step part of review process',
      },
      pendingApproval: {
        id: 'aosh.cms.application:review.step.tagText.pendingApproval',
        defaultMessage: 'Samþykki í bið',
        description:
          'Pending approval tag text in status step part of review process',
      },
    }),
    title: defineMessages({
      transferOfMachine: {
        id: 'aosh.cms.application:review.step.title.transferOfMachine',
        defaultMessage: 'Skráning eigendaskipta á tæki {variable}',
        description:
          'Transfer of machine title in status step part of review process',
      },
      payment: {
        id: 'aosh.cms.application:review.step.title.payment',
        defaultMessage: 'Greiðsla móttekin',
        description: 'Payment title in status step part of review process',
      },
      buyer: {
        id: 'aosh.cms.application:review.step.title.buyer',
        defaultMessage: 'Samþykki kaupanda',
        description: 'Buyer title in status step part of review process',
      },
    }),
    description: defineMessages({
      transferOfMachine: {
        id: 'aosh.cms.application:review.step.description.transferOfMachine',
        defaultMessage:
          'Tilkynning um eigendaskiptu hefur borist Vinnueftirlitinu',
        description:
          'Transfer of machine description in status step part of review process',
      },
      payment: {
        id: 'aosh.cms.application:review.step.description.payment',
        defaultMessage: 'Greitt hefur verið fyrir eigendaskiptin af seljanda',
        description:
          'Payment description in status step part of review process',
      },
      buyer: {
        id: 'aosh.cms.application:review.step.description.buyer',
        defaultMessage:
          'Beðið er eftir að nýr eigandi staðfesti eigendaskiptin',
        description: 'Buyer description in status step part of review process',
      },
    }),
  },
  buttons: defineMessages({
    back: {
      id: 'aosh.cms.application:review.buttons.back',
      defaultMessage: 'Til baka',
      description: 'Back button in review process',
    },
    reject: {
      id: 'aosh.cms.application:review.buttons.reject',
      defaultMessage: 'Hafna',
      description: 'Reject button in review process',
    },
    approve: {
      id: 'aosh.cms.application:review.buttons.approve',
      defaultMessage: `Samþykkja`,
      description: 'Approve button in review process',
    },
  }),
}
