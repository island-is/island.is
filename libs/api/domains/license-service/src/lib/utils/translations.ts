import { Locale } from 'locale'
import { LicenseLabelsObject } from '../licenceService.type'

export const getLabel = (
  labelKey: string,
  locale: Locale,
  label?: LicenseLabelsObject,
) => {
  return label
    ? label[labelKey]
    : Object.entries(i18n).find((x) => x[0] === labelKey)?.[1][locale] || ''
}

export const i18n = {
  licenseNumber: {
    is: 'Númer skírteinis',
    en: 'License number',
  },
  fullName: {
    is: 'Fullt nafn',
    en: 'Full name',
  },
  publisher: {
    is: 'Útgefandi',
    en: 'Publisher',
  },
  publishedDate: {
    is: 'Útgáfudagur',
    en: 'Published date',
  },
  firstPublishedDate: {
    is: 'Fyrsti útgáfudagur',
    en: 'First published date',
  },
  placeOfIssue: {
    is: 'Útgáfustaður',
    en: 'Place of issue',
  },
  validTo: {
    is: 'Gildir til',
    en: 'Valid to',
  },
  tanks: {
    is: 'Tankar',
    en: 'Tanks',
  },
  otherThanTanks: {
    is: 'Annað en í tanki',
    en: 'Other than tanks',
  },
  classesOfRights: {
    is: 'Réttindaflokkar',
    en: 'Classes of rights',
  },
  expiryDate: {
    is: 'Lokadagur',
    en: 'Expiry date',
  },
  comment: {
    is: 'Athugasemd',
    en: 'Comment',
  },
  renewDrivingLicense: {
    is: 'Endurnýja ökuskírteini',
    en: 'Renew driving license',
  },
  renewFirearmLicense: {
    is: 'Endurnýja skotvopnaleyfi',
    en: 'Renew firearm license',
  },
  downloadCard: {
    is: 'Hlaða niður korti',
    en: 'Download card',
  },
  applyForNewCard: {
    is: 'Sækja um nýtt kort',
    en: 'Apply for a new card',
  },
  collectorLicenseValidTo: {
    is: 'Safnaraskírteini gildir til',
    en: 'Collector license valid to',
  },
  category: {
    is: 'Flokkur',
    en: 'Category',
  },
  firearmProperties: {
    is: 'Skotvopn í eigu leyfishafa',
    en: 'Firearms owned by license holder',
  },
  firearmStatus: {
    is: 'Staða skotvopns',
    en: 'Firearm status',
  },
  type: {
    is: 'Tegund',
    en: 'Type',
  },
  name: {
    is: 'Heiti',
    en: 'Name',
  },
  number: {
    is: 'Númer',
    en: 'Serial number',
  },
  countryNumber: {
    is: 'Landsnúmer',
    en: 'Country number',
  },
  caliber: {
    is: 'Hlaupvídd',
    en: 'Caliber',
  },
  limitation: {
    is: 'Takmarkanir',
    en: 'Limitations',
  },
  drivingLicenseNumber: {
    is: 'Ökuskírteinisnúmer',
    en: 'Driving license number',
  },
  seeRights: {
    is: 'Sjá réttindi',
    en: 'See rights',
  },
  control: {
    is: 'Stjórna',
    en: 'Control',
  },
  teach: {
    is: 'Kenna',
    en: 'Teach',
  },
  basicInfoLicense: {
    is: 'Grunnupplýsingar skírteinis',
    en: 'Basic license information',
  },
  nationalId: {
    is: 'Kennitala',
    en: 'National Id',
  },
  cardNumber: {
    is: 'Númer korts',
    en: 'Card number',
  },
}
