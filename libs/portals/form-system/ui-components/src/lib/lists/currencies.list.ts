import { FormSystemListItem } from '@island.is/api/schema'

export const getCurrenciesList = (): FormSystemListItem[] => {
  return currenciesList.map((currency, index) => ({
    id: currency.code,
    label: {
      is: `${currency.code} - ${currency.name.is}`,
      en: `${currency.code} - ${currency.name.en}`,
    },
    value: currency.code,
    displayOrder: index,
    isSelected: false,
  }))
}

const currenciesList: { code: string; name: { is: string; en: string } }[] = [
  { code: 'EUR', name: { is: 'Evra', en: 'Euro' } },
  { code: 'USD', name: { is: 'Bandaríkjadalur', en: 'US Dollar' } },
  { code: 'GBP', name: { is: 'Sterlingspund', en: 'British Pound' } },
  { code: 'CAD', name: { is: 'Kanadadalur', en: 'Canadian Dollar' } },
  { code: 'DKK', name: { is: 'Dönsk króna', en: 'Danish Krone' } },
  { code: 'NOK', name: { is: 'Norsk króna', en: 'Norwegian Krone' } },
  { code: 'SEK', name: { is: 'Sænsk króna', en: 'Swedish Krona' } },
  { code: 'CHF', name: { is: 'Svissneskur franki', en: 'Swiss Franc' } },
  { code: 'JPY', name: { is: 'Japanskt jen', en: 'Japanese Yen' } },
  { code: 'CNY', name: { is: 'Kínverskt júan', en: 'Chinese Yuan' } },
  {
    code: 'NZD',
    name: { is: 'Ný-Sjálenskur dalur', en: 'New Zealand Dollar' },
  },
  { code: 'AUD', name: { is: 'Ástralíudalur', en: 'Australian Dollar' } },
  { code: 'HKD', name: { is: 'Hong Kong dalur', en: 'Hong Kong Dollar' } },
  { code: 'ZAR', name: { is: 'Suður-Afrískt rand', en: 'South African Rand' } },
  { code: 'CZK', name: { is: 'Tékknesk króna', en: 'Czech Koruna' } },
  { code: 'HUF', name: { is: 'Ungversk forinta', en: 'Hungarian Forint' } },
  { code: 'TRY', name: { is: 'Tyrknesk líra', en: 'Turkish Lira' } },
  { code: 'PLN', name: { is: 'Pólskt slot', en: 'Polish Zloty' } },
  {
    code: 'XDR',
    name: {
      is: 'Sérstök dráttarréttindi- SDR',
      en: 'Special Drawing Rights (SDR)',
    },
  },
  { code: 'KRW', name: { is: 'Suðurkóreskt vonn', en: 'South Korean Won' } },
  { code: 'ILS', name: { is: 'Ísraelskur sikill', en: 'Israeli Shekel' } },
  { code: 'SGD', name: { is: 'Singapúrskur dalur', en: 'Singapore Dollar' } },
  { code: 'MXN', name: { is: 'Mexíkóskur pesi', en: 'Mexican Peso' } },
  { code: 'INR', name: { is: 'Indversk rúpía', en: 'Indian Rupee' } },
  { code: 'BRL', name: { is: 'Brasilískt ríal', en: 'Brazilian Real' } },
  { code: 'THB', name: { is: 'Tælenskt bat', en: 'Thai Baht' } },
  { code: 'IDR', name: { is: 'Indónesísk rúpía', en: 'Indonesian Rupiah' } },
  { code: 'MYR', name: { is: 'Malasískt ringit', en: 'Malaysian Ringgit' } },
  { code: 'PHP', name: { is: 'Filippseyskur pesi', en: 'Philippine Peso' } },
  { code: 'RON', name: { is: 'Rúmenskt lei', en: 'Romanian Leu' } },
]
