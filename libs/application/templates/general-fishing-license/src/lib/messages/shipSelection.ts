import { defineMessages } from 'react-intl'

export const shipSelection = {
  general: defineMessages({
    sectionTitle: {
      id: 'gfl.application:shipSelection.general.sectionTitle',
      defaultMessage: 'Fiskveiðiskip',
      description: 'Ship selection section title',
    },
    title: {
      id: 'gfl.application:shipSelection.general.name',
      defaultMessage: 'Veldu skip',
      description: 'Ship selection title',
    },
    description: {
      id: 'gfl.application:shipSelection.general.description',
      defaultMessage: 'Hér er listi yfir fiskveiðiskip í boði.',
      description: 'Ship selection description',
    },
  }),
  labels: defineMessages({
    withFishingLicenseTitle: {
      id: 'gfl.application:shipSelection.labels.withFishingLicenseTitle',
      defaultMessage: 'Þessi fiskveiðiskip eru nú þegar með almennt veiðileyfi',
      description: 'With fishing license title in ship selection',
    },
    shipNumber: {
      id: 'gfl.application:shipSelection.labels.shipNumber',
      defaultMessage: 'Skipaskrárnúmer',
      description: 'Ship number label',
    },
    grossTonn: {
      id: 'gfl.application:shipSelection.labels.grossTonn',
      defaultMessage: 'Brúttótonn',
      description: 'Gross tonn label',
    },
    length: {
      id: 'gfl.application:shipSelection.labels.length',
      defaultMessage: 'Lengd',
      description: 'Ship length label',
    },
    homePort: {
      id: 'gfl.application:shipSelection.labels.homePort',
      defaultMessage: 'Heimahöfn',
      description: 'Home port label',
    },
    seaworthiness: {
      id: 'gfl.application:shipSelection.labels.seaworthiness',
      defaultMessage: 'Haffæri',
      description: 'Seaworthiness label',
    },
    validUntil: {
      id: 'gfl.application:shipSelection.labels.validUntil',
      defaultMessage: 'Gildir til {date}',
      description: 'Valid until label',
    },
    expired: {
      id: 'gfl.application:shipSelection.labels.expired',
      defaultMessage: 'Útrunnið {date}',
      description: 'Expired label',
    },
  }),
}
