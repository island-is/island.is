import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  dateFormat: {
    id: 'web.syslumenn.alcoholLicencesList:dateFormat',
    defaultMessage: 'd. MMMM yyyy',
    description: 'Hvernig dagsetningin birtist',
  },
  csvHeaderLicenceType: {
    id: 'web.syslumenn.alcoholLicencesList:csvHeaderLicenceType',
    defaultMessage: 'Tegund',
    description: 'Tegund (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderLicenceSubType: {
    id: 'web.syslumenn.alcoholLicencesList:csvHeaderLicenceSubType',
    defaultMessage: 'Tegund leyfis',
    description: 'Tegund leyfis (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderLicenseNumber: {
    id: 'web.syslumenn.alcoholLicencesList:csvHeaderLicenseNumber',
    defaultMessage: 'Leyfisnúmer',
    description: 'Leyfisnúmer (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderLicenseHolder: {
    id: 'web.syslumenn.alcoholLicencesList:csvHeaderLicenseHolder',
    defaultMessage: 'Leyfishafi',
    description: 'Leyfishafi (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderLicenseResponsible: {
    id: 'web.syslumenn.alcoholLicencesList:csvHeaderLicenseResponsible',
    defaultMessage: 'Ábyrgðarmaður',
    description: 'Ábyrgðarmaður (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderValidFrom: {
    id: 'web.syslumenn.alcoholLicencesList:csvHeaderValidFrom',
    defaultMessage: 'Gildir frá',
    description: 'Gildir frá (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderValidTo: {
    id: 'web.syslumenn.alcoholLicencesList:csvHeaderValidTo',
    defaultMessage: 'Gildir til',
    description: 'Gildir til (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderOffice: {
    id: 'web.syslumenn.alcoholLicencesList:csvHeaderOffice',
    defaultMessage: 'Embætti',
    description: 'Embætti (texti fyrir dálk í CSV skrá)',
  },
  csvHeaderLocation: {
    id: 'web.syslumenn.alcoholLicencesList:csvHeaderLocation',
    defaultMessage: 'Starfsstöð embættis',
    description: 'Starfsstöð embættis (texti fyrir dálk í CSV skrá)',
  },
  filterOfficeAll: {
    id: 'web.syslumenn.alcoholLicencesList:filterOfficeAll',
    defaultMessage: 'Öll embætti',
    description: 'Öll embætti',
  },
  filterLicenceTypeAll: {
    id: 'web.syslumenn.alcoholLicencesList:filterLicenceTypeAll',
    defaultMessage: 'Allar tegundir',
    description: 'Allar tegundir',
  },
  errorTitle: {
    id: 'web.syslumenn.alcoholLicencesList:errorTitle',
    defaultMessage: 'Villa',
    description: 'Titill á villuskilaboðum ef ekki tókst að sækja áfengisleyfi',
  },
  errorMessage: {
    id: 'web.syslumenn.alcoholLicencesList:errorMessage',
    defaultMessage: 'Ekki tókst að sækja áfengisleyfi.',
    description: 'Villuskilaboð ef ekki tókst að sækja áfengisleyfi',
  },
  alcoholLicencesFilterLicenceType: {
    id: 'web.syslumenn.alcoholLicencesList:alcoholLicencesFilterLicenceType',
    defaultMessage: 'Tegund',
    description: 'Label á tegund filter',
  },
  alcoholLicencesFilterOffice: {
    id: 'web.syslumenn.alcoholLicencesList:alcoholLicencesFilterOffice',
    defaultMessage: 'Embætti',
    description: 'Label á embættis filter',
  },
  searchPlaceholder: {
    id: 'web.syslumenn.alcoholLicencesList:searchPlaceholder',
    defaultMessage: 'Leita',
    description: 'Placeholder texti í leitarboxi',
  },
  csvButtonLabelDefault: {
    id: 'web.syslumenn.alcoholLicencesList:csvButtonLabelDefault',
    defaultMessage: 'Sækja öll leyfi (CSV).',
    description: 'Texti fyrir CSV hnapp',
  },
  csvButtonLabelLoading: {
    id: 'web.syslumenn.alcoholLicencesList:csvButtonLabelLoading',
    defaultMessage: 'Sæki öll leyfi...',
    description: 'Texti þegar smellt er á CSV hnapp',
  },
  csvButtonLabelError: {
    id: 'web.syslumenn.alcoholLicencesList:csvButtonLabelError',
    defaultMessage: 'Ekki tókst að sækja leyfi, reyndu aftur.',
    description: 'Texti fyrir CSV hnapp ef ekki tókst að sækja skrá',
  },
  csvFileTitlePrefix: {
    id: 'web.syslumenn.alcoholLicencesList:csvFileTitlePrefix',
    defaultMessage: 'Áfengisleyfi',
    description: 'Titill á CSV skrá',
  },
  noResults: {
    id: 'web.syslumenn.alcoholLicencesList:noResults',
    defaultMessage: 'Engin leyfi fundust',
    description: 'Texti sem birtist ef engin leyfi fundust',
  },
  licenseNumber: {
    id: 'web.syslumenn.alcoholLicencesList:licenseNumber',
    defaultMessage: 'Leyfisnúmer',
    description: 'Leyfisnúmer',
  },
  validPeriodLabel: {
    id: 'web.syslumenn.alcoholLicencesList:validPeriodLabel',
    defaultMessage: 'Gildistími',
    description: 'Gildistími',
  },
  validPeriodUntil: {
    id: 'web.syslumenn.alcoholLicencesList:validPeriodUntil',
    defaultMessage: 'Til',
    description: 'Til',
  },
  validPeriodIndefinite: {
    id: 'web.syslumenn.alcoholLicencesList:validPeriodIndefinite',
    defaultMessage: 'Ótímabundið',
    description: 'Ótímabundið',
  },
  licenseResponsible: {
    id: 'web.syslumenn.alcoholLicencesList:licenseResponsible',
    defaultMessage: 'Ábyrgðarmaður',
    description: 'Ábyrgðarmaður',
  },
  licenseResponsibleNotRegistered: {
    id: 'web.syslumenn.alcoholLicencesList:licenseResponsibleNotRegistered',
    defaultMessage: 'Enginn skráður',
    description: 'Enginn skráður',
  },
  loadMore: {
    id: 'web.syslumenn.alcoholLicencesList:loadMore',
    defaultMessage: 'Sjá fleiri',
    description: 'Sjá fleiri',
  },
})
