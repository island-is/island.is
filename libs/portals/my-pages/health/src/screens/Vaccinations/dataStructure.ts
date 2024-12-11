export interface VaccinationAge {
  years: number
  months: number
}

export interface Vaccination {
  id: number
  nationalId: string
  code: string
  vaccineName: string
  vaccinationDate: Date
  vaccinationAge: VaccinationAge
  generalComment: string
  rejected: boolean
}

export interface Vaccine {
  diseaseId: string
  diseaseName: string
  diseaseDescription: string // Markdown
  vaccinationStatus: string
  vaccinationStatusName: string
  lastVaccinationDate: Date | null
  vaccinations?: Array<Vaccination> | null
  comments: Array<string> // Markdown
}

export const generalVaccinationsData: Array<Vaccine> = [
  {
    diseaseId: 'influensa',
    diseaseName: 'Inflúensa',
    diseaseDescription: 'string',
    vaccinationStatus: 'expired',
    vaccinationStatusName: 'Útrunnið',
    lastVaccinationDate: new Date('2020-02-04T11:08:02.178Z'),
    vaccinations: [
      {
        id: 0,
        nationalId: '1234567890',
        code: 'J07BJ51',
        vaccineName: 'ATC',
        vaccinationDate: new Date('2020-02-04'),
        vaccinationAge: {
          years: 1,
          months: 2,
        },
        generalComment: 'ATC',
        rejected: false,
      },
    ],
    comments: [
      'Inflúensa er ekki skemmtileg',
      'Þetta er mikill texti um inflúensu, sjá meira [hér](https://www.heilsuvera.is/efnisflokkar/lyf-og-bolusetningar/)',
    ],
  },
  {
    diseaseId: 'covid-19',
    diseaseName: 'COVID-19',
    diseaseDescription: 'string',
    vaccinationStatus: 'expired',
    vaccinationStatusName: 'Útrunnið',
    lastVaccinationDate: new Date('2024-02-04T11:08:02.178Z'),
    vaccinations: [
      {
        id: 0,
        nationalId: '1234567890',
        code: 'J07BJ51',
        vaccineName: 'ATC',
        vaccinationDate: new Date('2020-02-04'),
        vaccinationAge: {
          years: 1,
          months: 2,
        },
        generalComment: 'ATC',
        rejected: false,
      },
      {
        id: 1,
        nationalId: '1234567890',
        vaccineName: 'ATC',
        code: 'J07BJ51',
        vaccinationDate: new Date('2024-02-04'),
        vaccinationAge: {
          years: 1,
          months: 2,
        },
        generalComment: 'ATC',
        rejected: false,
      },
    ],
    comments: [
      'Covid-19 er ekki skemmtileg',
      'Þetta er mikill texti um covid-19, sjá meira [hér](https://www.heilsuvera.is/efnisflokkar/lyf-og-bolusetningar/)',
    ],
  },
  {
    diseaseId: 'tetanus',
    diseaseName: 'Stífkrampi',
    diseaseDescription: 'string',
    vaccinationStatus: 'vaccinated',
    vaccinationStatusName: 'Í gildi',
    lastVaccinationDate: new Date('2024-08-09T11:08:02.178Z'),
    vaccinations: [
      {
        id: 0,
        nationalId: '1234567890',
        vaccineName: 'ATC',
        code: 'J07BJ51',
        vaccinationDate: new Date('2021-01-01'),
        vaccinationAge: {
          years: 1,
          months: 2,
        },
        generalComment: 'ATC',
        rejected: false,
      },
    ],
    comments: [
      'Stífkrampi er ekki skemmtilegur',
      'Þetta er mikill texti um stífkrampa, sjá meira [hér](https://www.heilsuvera.is/efnisflokkar/lyf-og-bolusetningar/)',
    ],
  },
  {
    diseaseId: 'chicken pox',
    diseaseName: 'Hlaupabóla',
    diseaseDescription: 'string',
    vaccinationStatus: 'unvaccinated',
    vaccinationStatusName: 'Óbólusett',
    lastVaccinationDate: null,
    vaccinations: null,
    comments: [
      'Hlaupabóla er ekki skemmtileg',
      'Þetta er mikill texti um hlaupabólu, sjá meira [hér](https://www.heilsuvera.is/efnisflokkar/lyf-og-bolusetningar/)',
    ],
  },
]

export const otherVaccinationsData: Array<Vaccine> = [
  {
    diseaseId: 'typhoid fever',
    diseaseName: 'Taugaveiki',
    diseaseDescription: 'string',
    vaccinationStatus: 'vaccinated',
    vaccinationStatusName: 'Í gildi',
    lastVaccinationDate: new Date('2024-08-09T11:08:02.178Z'),
    vaccinations: [
      {
        id: 0,
        nationalId: '1234567890',
        code: 'J07BJ51',
        vaccineName: 'ATC',
        vaccinationDate: new Date('2021-01-01'),
        vaccinationAge: {
          years: 1,
          months: 2,
        },
        generalComment: 'ATC',
        rejected: false,
      },
    ],
    comments: [
      'Taugaveiki er ekki skemmtileg',
      'Þetta er mikill texti um taugaveiki, sjá meira [hér](https://www.heilsuvera.is/efnisflokkar/lyf-og-bolusetningar/)',
    ],
  },
  {
    diseaseId: 'yellow fever',
    diseaseName: 'Gulusótt',
    diseaseDescription: 'string',
    vaccinationStatus: 'expired',
    vaccinationStatusName: 'Útrunnið',
    lastVaccinationDate: new Date('2024-08-09T11:08:02.178Z'),
    vaccinations: null,
    comments: [
      'Gulusótt er ekki skemmtileg',
      'Þetta er mikill texti um gulusótt, sjá meira [hér](https://www.heilsuvera.is/efnisflokkar/lyf-og-bolusetningar/)',
    ],
  },
]

// TEMP
// const rowDataDetail: Array<Array<DetailRow>> = [
//   [
//     {
//       value: '1',
//     },
//     {
//       value: '08.12.2008',
//     },
//     {
//       value: '20 ára 6 mán',
//     },
//     {
//       value: 'Typhim VI',
//       type: 'link',
//       url: 'https://www.heilsuvera.is/efnisflokkar/lyf-og-bolusetningar/',
//     },
//     {
//       value: 'Heilbrigðisstofnun Austurlands',
//     },
//   ],
//   [
//     {
//       value: '2',
//     },
//     {
//       value: '09.03.2011',
//     },
//     {
//       value: '23 ára 3 mán',
//     },
//     {
//       value: 'Typhim VI',
//       type: 'link',
//       url: 'https://www.heilsuvera.is/efnisflokkar/lyf-og-bolusetningar/',
//     },
//     {
//       value: 'Heilsugæslan á Egilsstöðum',
//     },
//   ],
//   [
//     {
//       value: '3',
//     },
//     {
//       value: '15.03.2016',
//     },
//     {
//       value: '27 ára 9 mán',
//     },
//     {
//       value: 'Typhim VI',
//       type: 'link',
//       url: 'https://www.heilsuvera.is/efnisflokkar/lyf-og-bolusetningar/',
//     },
//     {
//       value: 'Heilsugæsla Höfuðborgarsvæðissins',
//     },
//   ],
// ]
// const footerTextDetail = [
//   'Endurbólusetning á 3ja ára fresti ef hætta er á smiti.',
//   'Taugaveiki er landlæg í Asíu, Afríku, Mið- og Suður-Ameríku.',
// ]
// const rowData: Array<Array<DetailHeader>> = [
//   [
//     {
//       value: 'Barnaveiki',
//     },
//     {
//       value: '19.05.2016',
//     },
//     {
//       value: (
//         <Tag outlined variant="mint">
//           Lokið
//         </Tag>
//       ),
//       align: 'right',
//     },
//   ],
//   [
//     {
//       value: 'COVID-19',
//     },
//     {
//       value: '03.12.2021',
//     },
//     {
//       value: (
//         <Tag outlined variant="blue">
//           Útrunnið
//         </Tag>
//       ),
//       align: 'right',
//     },
//   ],
//   [
//     {
//       value: 'Hemofilus inflúensa B (Hib)',
//     },
//     {
//       value: '-',
//     },
//     {
//       value: (
//         <Tag outlined variant="red">
//           Óbólusett
//         </Tag>
//       ),
//       align: 'right',
//     },
//   ],
//   [
//     {
//       value: 'Hettusótt',
//     },
//     {
//       value: '-',
//     },
//     {
//       value: (
//         <Tag outlined variant="red">
//           Óbólusett
//         </Tag>
//       ),
//       align: 'right',
//     },
//   ],
//   [
//     {
//       value: 'Hlaupabóla',
//     },
//     {
//       value: '-',
//     },
//     {
//       value: (
//         <Tag outlined variant="red">
//           Óbólusett
//         </Tag>
//       ),
//     },
//   ],
//   [
//     {
//       value: 'HPV',
//     },
//     {
//       value: '-',
//     },
//     {
//       value: (
//         <Tag outlined variant="red">
//           Óbólusett
//         </Tag>
//       ),
//     },
//   ],
//   [
//     {
//       value: 'Inflúensa',
//     },
//     {
//       value: '20.12.2022',
//     },
//     {
//       value: (
//         <Tag outlined variant="blue">
//           Útrunnið
//         </Tag>
//       ),
//     },
//   ],
//   [
//     {
//       value: 'Kíghósti',
//     },
//     {
//       value: '19.05.2016',
//     },
//     {
//       value: (
//         <Tag outlined variant="mint">
//           Í gildi
//         </Tag>
//       ),
//     },
//   ],
// ]
