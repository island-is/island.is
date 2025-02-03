import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  dateFormat: {
    id: 'web.syslumenn.burningPermitList:dateFormat',
    defaultMessage: 'd. MMMM yyyy',
    description: 'Hvernig dagsetningin birtist',
  },
  errorTitle: {
    id: 'web.syslumenn.burningPermitList:errorTitle',
    defaultMessage: 'Villa',
    description: 'Titill á villuskilaboðum ef ekki tókst að sækja leyfi',
  },
  errorMessage: {
    id: 'web.syslumenn.burningPermitList:errorMessage',
    defaultMessage: 'Ekki tókst að sækja leyfi.',
    description: 'Villuskilaboð ef ekki tókst að sækja leyfi',
  },
  licensee: {
    id: 'web.syslumenn.burningPermitList:licensee',
    defaultMessage: 'Leyfishafi',
    description: 'Leyfishafi',
  },
  size: {
    id: 'web.syslumenn.burningPermitList:size',
    defaultMessage: 'Fermetrastærð',
    description: 'Fermetrastærð',
  },
  place: {
    id: 'web.syslumenn.burningPermitList:place',
    defaultMessage: 'Staður',
    description: 'Staður',
  },
  office: {
    id: 'web.syslumenn.burningPermitList:office',
    defaultMessage: 'Embætti',
    description: 'Embætti',
  },
  date: {
    id: 'web.syslumenn.burningPermitList:date',
    defaultMessage: 'Dagsetning',
    description: 'Dagsetning',
  },
  responsibleParty: {
    id: 'web.syslumenn.burningPermitList:responsibleParty',
    defaultMessage: 'Ábyrgðaraðili',
    description: 'Ábyrgðaraðili',
  },
  searchPlaceholder: {
    id: 'web.syslumenn.burningPermitList:searchPlaceholder',
    defaultMessage: 'Leita',
    description: 'Placeholder texti í leitarboxi',
  },
  csvButtonLabelDefault: {
    id: 'web.syslumenn.burningPermitList:csvButtonLabelDefault',
    defaultMessage: 'Sækja öll leyfi (CSV).',
    description: 'Texti fyrir CSV hnapp',
  },
  csvButtonLabelLoading: {
    id: 'web.syslumenn.burningPermitList:csvButtonLabelLoading',
    defaultMessage: 'Sæki öll leyfi...',
    description: 'Texti þegar smellt er á CSV hnapp',
  },
  csvButtonLabelError: {
    id: 'web.syslumenn.burningPermitList:csvButtonLabelError',
    defaultMessage: 'Ekki tókst að sækja leyfi, reyndu aftur.',
    description: 'Texti fyrir CSV hnapp ef ekki tókst að sækja skrá',
  },
  csvFileTitlePrefix: {
    id: 'web.syslumenn.burningPermitList:csvFileTitlePrefix',
    defaultMessage: 'Brennuleyfi',
    description: 'Titill á CSV skrá',
  },
  noResults: {
    id: 'web.syslumenn.burningPermitList:noResults',
    defaultMessage: 'Engin leyfi fundust',
    description: 'Texti sem birtist ef engin leyfi fundust',
  },
  type: {
    id: 'web.syslumenn.burningPermitList:type',
    defaultMessage: 'Tegund',
    description: 'Tegund',
  },
  subtype: {
    id: 'web.syslumenn.burningPermitList:subtype',
    defaultMessage: 'Undirtegund',
    description: 'Undirtegund',
  },
  loadMore: {
    id: 'web.syslumenn.burningPermitList:loadMore',
    defaultMessage: 'Sjá fleiri',
    description: 'Sjá fleiri',
  },
})
