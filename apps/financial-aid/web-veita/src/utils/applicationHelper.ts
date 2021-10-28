import {
  Application,
  getHomeCircumstances,
  HomeCircumstances,
  getEmploymentStatus,
  Employment,
  insertAt,
  formatPhoneNumber,
  formatNationalId,
} from '@island.is/financial-aid/shared/lib'
import { calcAge } from './formHelper'

export const getApplicant = (application: Application) => {
  return [
    {
      title: 'Nafn',
      content: application.name,
    },
    {
      title: 'Aldur',
      content: calcAge(application.nationalId) + ' ára',
    },
    {
      title: 'Kennitala',
      content: insertAt(application.nationalId.replace('-', ''), '-', 6) || '-',
    },
    {
      title: 'Netfang',
      content: application.email,
      link: 'mailto:' + application.email,
    },
    {
      title: 'Sími',
      content: formatPhoneNumber(application.phoneNumber ?? ''),
      link: 'tel:' + application.phoneNumber,
    },
    {
      title: 'Bankareikningur',
      content:
        application.bankNumber +
        '-' +
        application.ledger +
        '-' +
        application.accountNumber,
    },
    {
      title: 'Nota persónuafslátt',
      content: application.usePersonalTaxCredit ? 'Já' : 'Nei',
    },
    {
      title: 'Ríkisfang',
      content: 'Ísland',
    },
  ]
}

export const getApplicantMoreInfo = (application: Application) => {
  return [
    {
      title: 'Lögheimili',
      content: application.streetName,
    },
    {
      title: 'Póstnúmer',
      content: application.postalCode,
    },
    {
      title: 'Maki',
      content: application.spouseNationalId
        ? formatNationalId(application.spouseNationalId)
        : 'Enginn maki',
    },
    {
      title: 'Búsetuform',
      content:
        getHomeCircumstances[
          application.homeCircumstances as HomeCircumstances
        ],
      other: application.homeCircumstancesCustom,
    },
    {
      title: 'Atvinna',
      content: getEmploymentStatus[application.employment as Employment],
      other: application.employmentCustom,
    },
    {
      title: 'Lánshæft nám',
      content: application.student ? 'Já' : 'Nei',
      other: application.studentCustom,
    },
    {
      title: 'Hefur haft tekjur',
      content: application.hasIncome ? 'Já' : 'Nei',
    },
    {
      title: 'Athugasemd',
      other: application.formComment,
    },
  ]
}
