import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  dateFormat: {
    id: 'web.syslumenn.temporaryEventLicencesList:dateFormat',
    defaultMessage: "d. MMMM yyyy 'kl.' HH:mm",
    description: 'Hvernig dagsetningin birtist',
  },
  csvHeaderLicenceType: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvHeaderLicenceType',
    defaultMessage: 'Tegund',
    description: 'Tegund (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderLicenceSubType: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvHeaderLicenceSubType',
    defaultMessage: "'Tegund leyfis",
    description: 'Tegund leyfis (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderLicenseNumber: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvHeaderLicenseNumber',
    defaultMessage: 'Leyfisnúmer',
    description: 'Leyfisnúmer (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderLicenseHolder: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvHeaderLicenseHolder',
    defaultMessage: 'Leyfishafi',
    description: 'Leyfishafi (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderLicenseResponsible: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvHeaderLicenseResponsible',
    defaultMessage: 'Ábyrgðarmaður',
    description: 'Ábyrgðarmaður (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderValidFrom: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvHeaderValidFrom',
    defaultMessage: 'Gildir frá',
    description: 'Gildir frá (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderValidTo: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvHeaderValidTo',
    defaultMessage: 'Gildir til',
    description: 'Gildir til (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderIssuedBy: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvHeaderIssuedBy',
    defaultMessage: 'Útgefið af',
    description: 'Útgefið af (texti fyrir dálk í CSV skrá)',
  },
  filterOfficeAll: {
    id: 'web.syslumenn.temporaryEventLicencesList:filterOfficeAll',
    defaultMessage: 'Öll embætti',
    description: 'Öll embætti',
  },
  filterLicenceSubTypeAll: {
    id: 'web.syslumenn.temporaryEventLicencesList:filterLicenceSubTypeAll',
    defaultMessage: 'Allar tegundir',
    description: 'Allar tegundir',
  },
  errorTitle: {
    id: 'web.syslumenn.temporaryEventLicencesList:errorTitle',
    defaultMessage: 'Villa',
    description:
      'Titill á villuskilaboðum ef ekki tókst að sækja tækifærisleyfi',
  },
  errorMessage: {
    id: 'web.syslumenn.temporaryEventLicencesList:errorMessage',
    defaultMessage: 'Ekki tókst að sækja tækifærisleyfi.',
    description: 'Villutexti sem birtist ef ekki tókst að sækja tækifærisleyfi',
  },
  alcoholLicencesFilterLicenceSubType: {
    id: 'web.syslumenn.temporaryEventLicencesList:alcoholLicencesFilterLicenceSubType',
    defaultMessage: 'Tegund',
    description: 'Label fyrir tegund filter',
  },
  alcoholLicencesFilterOffice: {
    id: 'web.syslumenn.temporaryEventLicencesList:alcoholLicencesFilterOffice',
    defaultMessage: 'Embætti',
    description: 'Label fyrir embættis filter',
  },
  searchPlaceholder: {
    id: 'web.syslumenn.temporaryEventLicencesList:searchPlaceholder',
    defaultMessage: 'Leita',
    description: 'Placeholder texti fyrir leitarbox',
  },
  noResults: {
    id: 'web.syslumenn.temporaryEventLicencesList:noResults',
    defaultMessage: 'Engin leyfi fundust',
    description: 'Texti sem birtist ef engin leyfi fundust',
  },
  licenseNumber: {
    id: 'web.syslumenn.temporaryEventLicencesList:licenseNumber',
    defaultMessage: 'Leyfisnúmer',
    description: 'Leyfisnúmer',
  },
  validPeriodLabel: {
    id: 'web.syslumenn.temporaryEventLicencesList:validPeriodLabel',
    defaultMessage: 'Gildistími',
    description: 'Gildistími',
  },
  validPeriodUntil: {
    id: 'web.syslumenn.temporaryEventLicencesList:validPeriodUntil',
    defaultMessage: 'Til',
    description: 'Til',
  },
  validPeriodIndefinite: {
    id: 'web.syslumenn.temporaryEventLicencesList:validPeriodIndefinite',
    defaultMessage: 'Ótímabundið',
    description: 'Ótímabundið',
  },
  licenseResponsible: {
    id: 'web.syslumenn.temporaryEventLicencesList:licenseResponsible',
    defaultMessage: 'Ábyrgðarmaður',
    description: 'Ábyrgðarmaður',
  },
  licenseResponsibleNotRegistered: {
    id: 'web.syslumenn.temporaryEventLicencesList:licenseResponsibleNotRegistered',
    defaultMessage: 'Enginn skráður',
    description: 'Enginn skráður',
  },
  licenseEstimatedNumberOfGuests: {
    id: 'web.syslumenn.temporaryEventLicencesList:licenseEstimatedNumberOfGuests',
    defaultMessage: 'Áætlaður fjöldi gesta',
    description: 'Áætlaður fjöldi gesta',
  },
  licenseMaximumNumberOfGuests: {
    id: 'web.syslumenn.temporaryEventLicencesList:licenseMaximumNumberOfGuests',
    defaultMessage: 'Hámarksfjöldi gesta',
    description: 'Hámarksfjöldi gesta',
  },
  loadMore: {
    id: 'web.syslumenn.temporaryEventLicencesList:loadMore',
    defaultMessage: 'Sjá fleiri',
    description: 'Sjá fleiri',
  },
  csvButtonLabelDefault: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvButtonLabelDefault',
    defaultMessage: 'Sækja öll leyfi (CSV).',
    description: 'Texti fyrir CSV hnapp',
  },
  csvButtonLabelLoading: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvButtonLabelLoading',
    defaultMessage: 'Sæki öll leyfi...',
    description: 'Texti þegar smellt er á CSV hnapp',
  },
  csvButtonLabelError: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvButtonLabelError',
    defaultMessage: 'Ekki tókst að sækja leyfi, reyndu aftur.',
    description: 'Texti fyrir CSV hnapp ef ekki tókst að sækja skrá',
  },
  csvFileTitlePrefix: {
    id: 'web.syslumenn.temporaryEventLicencesList:csvFileTitlePrefix',
    defaultMessage: 'Tækifærisleyfi',
    description: 'Titill á CSV skrá',
  },
})
