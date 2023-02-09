import { defineMessages } from 'react-intl'

export const review = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.cov.application:review.general.sectionTitle',
      defaultMessage: 'Til samþykktar',
      description: 'Title of overview screen',
    },
    approvedSectionTitle: {
      id: 'ta.cov.application:review.general.approvedSectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Approved section title of overview screen',
    },
  }),
  status: defineMessages({
    title: {
      id: 'ta.cov.application:review.status.title',
      defaultMessage: 'Staða tilkynningar',
      description: 'Title in status part of review process',
    },
    description: {
      id: 'ta.cov.application:review.status.description',
      defaultMessage: 'Hér að neðan kemur fram hvað gerist næst',
      description: 'Description in status part of review process',
    },
    viewOverview: {
      id: 'ta.cov.application:review.status.viewOverview',
      defaultMessage: 'Skoða yfirlit',
      description: 'View overview label in status part of review process',
    },
    openAgreement: {
      id: 'ta.cov.application:review.status.openAgreement',
      defaultMessage: 'Opna samþykki',
      description: 'Open agreement label in status part of review process',
    },
    youLabel: {
      id: 'ta.cov.application:review.status.youLabel',
      defaultMessage: 'þú',
      description: 'You label in status part of review process',
    },
  }),
  step: {
    tagText: defineMessages({
      received: {
        id: 'ta.cov.application:review.step.tagText.received',
        defaultMessage: 'Móttekin',
        description: 'Received tag text in status step part of review process',
      },
      pendingApproval: {
        id: 'ta.cov.application:review.step.tagText.pendingApproval',
        defaultMessage: 'Samþykki í bið',
        description:
          'Pending approval tag text in status step part of review process',
      },
    }),
    title: defineMessages({
      transferOfVehicle: {
        id: 'ta.cov.application:review.step.title.transferOfVehicle',
        defaultMessage: 'Skráning umráðamanns á ökutæki {variable}',
        description:
          'Transfer of vehicle title in status step part of review process',
      },
      payment: {
        id: 'ta.cov.application:review.step.title.payment',
        defaultMessage: 'Greiðsla móttekin',
        description: 'Payment title in status step part of review process',
      },
      coOwner: {
        id: 'ta.cov.application:review.step.title.coOwner',
        defaultMessage: 'Samþykki meðeiganda',
        description:
          'Buyer coowner title in status step part of review process',
      },
      operator: {
        id: 'ta.cov.application:review.step.title.operator',
        defaultMessage: 'Samþykki umráðarmanns',
        description:
          'Buyer operator title in status step part of review process',
      },
    }),
    description: defineMessages({
      transferOfVehicle: {
        id: 'ta.cov.application:review.step.description.transferOfVehicle',
        defaultMessage:
          'Tilkynning um skráningu hefur borist til Samgöngustofu',
        description:
          'Transfer of vehicle description in status step part of review process',
      },
      payment: {
        id: 'ta.cov.application:review.step.description.payment',
        defaultMessage:
          'Greitt hefur verið fyrir skráningu umráðamanns af eiganda',
        description:
          'Payment description in status step part of review process',
      },
      coOwner: {
        id: 'ta.cov.application:review.step.description.coOwner',
        defaultMessage:
          'Beðið er eftir að meðeigandi bifreiðar samþykki skráningu umráðamanns',
        description:
          'Buyer coowner description in status step part of review process',
      },
      operator: {
        id: 'ta.cov.application:review.step.description.operator',
        defaultMessage:
          'Beðið er eftir að umráðamaður bifreiðar samþykki skráninguna',
        description:
          'Buyer operator description in status step part of review process',
      },
    }),
  },
  buttons: defineMessages({
    back: {
      id: 'ta.cov.application:review.buttons.back',
      defaultMessage: 'Til baka',
      description: 'Back button in review process',
    },
    reject: {
      id: 'ta.cov.application:review.buttons.reject',
      defaultMessage: 'Hafna',
      description: 'Reject button in review process',
    },
    approve: {
      id: 'ta.cov.application:review.buttons.approve',
      defaultMessage: `Samþykkja`,
      description: 'Approve button in review process',
    },
  }),
}
