import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Shared
  errorTitle: {
    id: 'web.customsGeneral:errorTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Error title shown when a customs general query fails',
  },
  errorMessage: {
    id: 'web.customsGeneral:errorMessage',
    defaultMessage: 'Ekki tókst að sækja gögn. Reyndu aftur síðar.',
    description:
      'Generic error message shown when a customs general query fails',
  },
  dateLabel: {
    id: 'web.customsGeneral:dateLabel',
    defaultMessage: 'Viðmiðunardagsetning',
    description: 'Label for the reference date picker',
  },
  columnCode: {
    id: 'web.customsGeneral:columnCode',
    defaultMessage: 'Kóði',
    description: 'Table column header: code',
  },
  columnName: {
    id: 'web.customsGeneral:columnName',
    defaultMessage: 'Heiti',
    description: 'Table column header: name/title',
  },
  columnDescription: {
    id: 'web.customsGeneral:columnDescription',
    defaultMessage: 'Lýsing',
    description: 'Table column header: description',
  },
  columnValidFrom: {
    id: 'web.customsGeneral:columnValidFrom',
    defaultMessage: 'Gildir frá',
    description: 'Table column header: valid from date',
  },
  columnValidTo: {
    id: 'web.customsGeneral:columnValidTo',
    defaultMessage: 'Gildir til',
    description: 'Table column header: valid to date',
  },

  // StorageLocations columns
  storageLocationNationalId: {
    id: 'web.customsGeneral:geymslustadurKennitala',
    defaultMessage: 'Kennitala',
    description: 'Column header: national ID of the storage location operator',
  },
  storageLocationCode: {
    id: 'web.customsGeneral:geymslustadurCode',
    defaultMessage: 'Kóði',
    description: 'Column header: storage location code',
  },
  storageLocationCompanyName: {
    id: 'web.customsGeneral:geymslustadurCompanyName',
    defaultMessage: 'Fyrirtæki',
    description: 'Column header: company name of the storage location operator',
  },
  storageLocationLocation: {
    id: 'web.customsGeneral:geymslustadurLocation',
    defaultMessage: 'Staðsetning geymslusvæðis',
    description: 'Column header: physical location of the storage area',
  },

  // ExchangeRates columns
  exchangeRateRate: {
    id: 'web.customsGeneral:tollgengiRate',
    defaultMessage: 'Gengi',
    description: 'Column header: exchange rate',
  },

  // TariffKeys columns
  tariffKeyVersion: {
    id: 'web.customsGeneral:tollskrarLyklarVersion',
    defaultMessage: 'Útgáfa',
    description: 'Column header: tariff key version',
  },
  tariffKeyPeriodFrom: {
    id: 'web.customsGeneral:tollskrarLyklarPeriodFrom',
    defaultMessage: 'Tímabil frá',
    description: 'Column header: period from date',
  },
  tariffKeyPeriodTo: {
    id: 'web.customsGeneral:tollskrarLyklarPeriodTo',
    defaultMessage: 'Tímabil til',
    description: 'Column header: period to date',
  },
  tariffKeyJsonUrl: {
    id: 'web.customsGeneral:tollskrarLyklarJsonUrl',
    defaultMessage: 'JSON skrá',
    description: 'Column header: URL to JSON file',
  },
  tariffKeyTextUrl: {
    id: 'web.customsGeneral:tollskrarLyklarTextUrl',
    defaultMessage: 'Texti skrá',
    description: 'Column header: URL to text file',
  },

  // CountryCurrencies columns
  countryCurrencyCountryCode: {
    id: 'web.customsGeneral:landMyntCountryCode',
    defaultMessage: 'Landakóði',
    description: 'Column header: country code',
  },
  countryCurrencyCountryName: {
    id: 'web.customsGeneral:landMyntCountryName',
    defaultMessage: 'Heiti lands',
    description: 'Column header: country name',
  },
  countryCurrencyCurrencyCode: {
    id: 'web.customsGeneral:landMyntCurrencyCode',
    defaultMessage: 'Myntkóði',
    description: 'Column header: currency code',
  },
  countryCurrencyCurrencyName: {
    id: 'web.customsGeneral:landMyntCurrencyName',
    defaultMessage: 'Heiti myntar',
    description: 'Column header: currency name',
  },

  // Exemptions specific
  exemptionColumnKey: {
    id: 'web.customsGeneral:undanthagurColumnLykill',
    defaultMessage: 'Lykill',
    description: 'Exemptions table column header: code/key',
  },
  exemptionColumnDescription: {
    id: 'web.customsGeneral:undanthagurColumnSkyring',
    defaultMessage: 'Skýring',
    description: 'Exemptions table column header: description/explanation',
  },
  exemptionDetailDate: {
    id: 'web.customsGeneral:undanthagurDetailDagsetning',
    defaultMessage: 'Dagsetning',
    description: 'Exemptions detail view label: date',
  },
  exemptionDetailTransportDirection: {
    id: 'web.customsGeneral:undanthagurDetailFlutningsleid',
    defaultMessage: 'Flutningsleið',
    description: 'Exemptions detail view label: transport direction',
  },
  exemptionDetailValidityPeriod: {
    id: 'web.customsGeneral:undanthagurDetailGildistimi',
    defaultMessage: 'Gildistími',
    description: 'Exemptions detail view label: validity period',
  },
  exemptionIndefinite: {
    id: 'web.customsGeneral:undanthagurOtimabundid',
    defaultMessage: 'ótímabundið',
    description: 'Exemptions detail view: indefinite/unlimited validity',
  },
  exemptionLegalArticle: {
    id: 'web.customsGeneral:undanthagurLagagrein',
    defaultMessage: 'Lagagrein',
    description: 'Exemptions detail view section: legal article',
  },
  exemptionDescription: {
    id: 'web.customsGeneral:undanthagurLysing',
    defaultMessage: 'Lýsing',
    description: 'Exemptions detail view section: description',
  },
  exemptionBackToList: {
    id: 'web.customsGeneral:undanthagurBackToList',
    defaultMessage: 'Sjá lista yfir undanþágur',
    description: 'Exemptions detail view: back to list button label',
  },

  // AssessmentLocations columns
  assessmentLocationLocation: {
    id: 'web.customsGeneral:akvordunarstadirLocation',
    defaultMessage: 'Staður',
    description: 'Column header: assessment location code',
  },
  assessmentLocationLocationName: {
    id: 'web.customsGeneral:akvordunarstadirLocationName',
    defaultMessage: 'Staðarheiti',
    description: 'Column header: assessment location name',
  },
})
