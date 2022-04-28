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
    meters: {
      id: 'gfl.application:shipSelection.labels.meters',
      defaultMessage: 'metrar',
      description: 'Ship length meters label',
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
    expiredMessage: {
      id: 'gfl.application:shipSelection.labels.expiredMessage',
      defaultMessage:
        'Vinsamlegast hafðu samband við Samgöngustofu til þess að endurnýja haffærin',
      description: 'Expired message',
    },
    deprivation: {
      id: 'gfl.application:shipSelection.labels.deprivation',
      defaultMessage: 'Svipting/ar',
      description: 'Deprivation label',
    },
  }),
  tags: defineMessages({
    noFishingLicensesFound: {
      id: 'gfl.application:shipSelection.tags.noFishingLicensesFound',
      defaultMessage: 'Engin gild veiðileyfi fundust',
      description: 'No fishing license found tag',
    },
    catchMark: {
      id: 'gfl.application:shipSelection.tags.catchMark',
      defaultMessage: 'Almennt veiðileyfi með aflamarki',
      description: 'Catch mark tag',
    },
    hookCatchLimit: {
      id: 'gfl.application:shipSelection.tags.hookCatchLimit',
      defaultMessage: 'Almennt veiðileyfi með krókaafla',
      description: 'Hook catch limit tag',
    },
  }),
}
