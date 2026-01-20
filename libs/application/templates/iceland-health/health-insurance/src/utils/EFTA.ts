export type TEfta = {
  name: string
  topLevelDomain: Array<string>
  alpha2Code: string
  alpha3Code: string
  callingCodes: Array<string>
  capital: string
  altSpellings: Array<string>
  region: string
}

export const EFTA: Array<TEfta> = [
  {
    name: 'Iceland',
    topLevelDomain: ['.is'],
    alpha2Code: 'IS',
    alpha3Code: 'ISL',
    callingCodes: ['354'],
    capital: 'Reykjavík',
    altSpellings: ['IS', 'Island', 'Republic of Iceland', 'Lýðveldið Ísland'],
    region: 'Europe',
  },
  {
    name: 'Liechtenstein',
    topLevelDomain: ['.li'],
    alpha2Code: 'LI',
    alpha3Code: 'LIE',
    callingCodes: ['423'],
    capital: 'Vaduz',
    altSpellings: [
      'LI',
      'Principality of Liechtenstein',
      'Fürstentum Liechtenstein',
    ],
    region: 'Europe',
  },
  {
    name: 'Norway',
    topLevelDomain: ['.no'],
    alpha2Code: 'NO',
    alpha3Code: 'NOR',
    callingCodes: ['47'],
    capital: 'Oslo',
    altSpellings: [
      'NO',
      'Norge',
      'Noreg',
      'Kingdom of Norway',
      'Kongeriket Norge',
      'Kongeriket Noreg',
    ],
    region: 'Europe',
  },
  {
    name: 'Switzerland',
    topLevelDomain: ['.ch'],
    alpha2Code: 'CH',
    alpha3Code: 'CHE',
    callingCodes: ['41'],
    capital: 'Bern',
    altSpellings: [
      'CH',
      'Swiss Confederation',
      'Schweiz',
      'Suisse',
      'Svizzera',
      'Svizra',
    ],
    region: 'Europe',
  },
]
