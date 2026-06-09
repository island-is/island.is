import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Shared
  errorTitle: {
    id: 'web.customsGeneral:errorTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Error title shown when a customs general query fails',
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

  // Geymslustadur columns
  geymslustadurKennitala: {
    id: 'web.customsGeneral:geymslustadurKennitala',
    defaultMessage: 'Kennitala',
    description: 'Column header: national ID of the storage location operator',
  },
  geymslustadurCode: {
    id: 'web.customsGeneral:geymslustadurCode',
    defaultMessage: 'Kóði',
    description: 'Column header: storage location code',
  },
  geymslustadurCompanyName: {
    id: 'web.customsGeneral:geymslustadurCompanyName',
    defaultMessage: 'Fyrirtæki',
    description: 'Column header: company name of the storage location operator',
  },
  geymslustadurLocation: {
    id: 'web.customsGeneral:geymslustadurLocation',
    defaultMessage: 'Staðsetning geymslusvæðis',
    description: 'Column header: physical location of the storage area',
  },

  // Tollgengi columns
  tollgengiRate: {
    id: 'web.customsGeneral:tollgengiRate',
    defaultMessage: 'Gengi',
    description: 'Column header: exchange rate',
  },

  // TollskrarLyklar columns
  tollskrarLyklarVersion: {
    id: 'web.customsGeneral:tollskrarLyklarVersion',
    defaultMessage: 'Útgáfa',
    description: 'Column header: tariff key version',
  },
  tollskrarLyklarPeriodFrom: {
    id: 'web.customsGeneral:tollskrarLyklarPeriodFrom',
    defaultMessage: 'Tímabil frá',
    description: 'Column header: period from date',
  },
  tollskrarLyklarPeriodTo: {
    id: 'web.customsGeneral:tollskrarLyklarPeriodTo',
    defaultMessage: 'Tímabil til',
    description: 'Column header: period to date',
  },
  tollskrarLyklarJsonUrl: {
    id: 'web.customsGeneral:tollskrarLyklarJsonUrl',
    defaultMessage: 'JSON skrá',
    description: 'Column header: URL to JSON file',
  },
  tollskrarLyklarTextUrl: {
    id: 'web.customsGeneral:tollskrarLyklarTextUrl',
    defaultMessage: 'Texti skrá',
    description: 'Column header: URL to text file',
  },

  // LandMynt columns
  landMyntCountryCode: {
    id: 'web.customsGeneral:landMyntCountryCode',
    defaultMessage: 'Landakóði',
    description: 'Column header: country code',
  },
  landMyntCountryName: {
    id: 'web.customsGeneral:landMyntCountryName',
    defaultMessage: 'Heiti lands',
    description: 'Column header: country name',
  },
  landMyntCurrencyCode: {
    id: 'web.customsGeneral:landMyntCurrencyCode',
    defaultMessage: 'Myntkóði',
    description: 'Column header: currency code',
  },
  landMyntCurrencyName: {
    id: 'web.customsGeneral:landMyntCurrencyName',
    defaultMessage: 'Heiti myntar',
    description: 'Column header: currency name',
  },

  // Urvinnslugjold columns
  urvinnslugjoldTariffNumber: {
    id: 'web.customsGeneral:urvinnslugjoldTariffNumber',
    defaultMessage: 'Tollskránúmer',
    description: 'Column header: tariff number',
  },
  urvinnslugjoldPlRatio: {
    id: 'web.customsGeneral:urvinnslugjoldPlRatio',
    defaultMessage: 'PL hlutfall',
    description: 'Column header: PL ratio',
  },
  urvinnslugjoldPpRatio: {
    id: 'web.customsGeneral:urvinnslugjoldPpRatio',
    defaultMessage: 'PP hlutfall',
    description: 'Column header: PP ratio',
  },

  // Undanthagur specific
  undanthagurColumnLykill: {
    id: 'web.customsGeneral:undanthagurColumnLykill',
    defaultMessage: 'Lykill',
    description: 'Undanthagur table column header: code/key',
  },
  undanthagurColumnSkyring: {
    id: 'web.customsGeneral:undanthagurColumnSkyring',
    defaultMessage: 'Skýring',
    description: 'Undanthagur table column header: description/explanation',
  },
  undanthagurDetailDagsetning: {
    id: 'web.customsGeneral:undanthagurDetailDagsetning',
    defaultMessage: 'Dagsetning',
    description: 'Undanthagur detail view label: date',
  },
  undanthagurDetailFlutningsleid: {
    id: 'web.customsGeneral:undanthagurDetailFlutningsleid',
    defaultMessage: 'Flutningsleið',
    description: 'Undanthagur detail view label: transport direction',
  },
  undanthagurDetailGildistimi: {
    id: 'web.customsGeneral:undanthagurDetailGildistimi',
    defaultMessage: 'Gildistími',
    description: 'Undanthagur detail view label: validity period',
  },
  undanthagurOtimabundid: {
    id: 'web.customsGeneral:undanthagurOtimabundid',
    defaultMessage: 'ótímabundið',
    description: 'Undanthagur detail view: indefinite/unlimited validity',
  },
  undanthagurLagagrein: {
    id: 'web.customsGeneral:undanthagurLagagrein',
    defaultMessage: 'Lagagrein',
    description: 'Undanthagur detail view section: legal article',
  },
  undanthagurLysing: {
    id: 'web.customsGeneral:undanthagurLysing',
    defaultMessage: 'Lýsing',
    description: 'Undanthagur detail view section: description',
  },
  undanthagurBackToList: {
    id: 'web.customsGeneral:undanthagurBackToList',
    defaultMessage: 'Sjá lista yfir undanþágur',
    description: 'Undanthagur detail view: back to list button label',
  },

  // Akvordunarstadir columns
  akvordunarstadirLocation: {
    id: 'web.customsGeneral:akvordunarstadirLocation',
    defaultMessage: 'Staður',
    description: 'Column header: determination location code',
  },
  akvordunarstadirLocationName: {
    id: 'web.customsGeneral:akvordunarstadirLocationName',
    defaultMessage: 'Staðarheiti',
    description: 'Column header: determination location name',
  },
})
