import {
  Application,
  getHomeCircumstances,
  HomeCircumstances,
  getEmploymentStatus,
  Employment,
  formatPhoneNumber,
  formatNationalId,
  DirectTaxPayment,
  sanitizeOnlyNumbers,
} from '@island.is/financial-aid/shared/lib'
import { calcAge } from './formHelper'

export const getApplicant = (application: Application) => {
  return [
    {
      title: 'Nafn',
      content: application.name,
    },
    {
      title: 'Kennitala',
      content: formatNationalId(application.nationalId),
      link: '/leit?search=' + sanitizeOnlyNumbers(application.nationalId),
    },
    {
      title: 'Sími',
      content: formatPhoneNumber(application.phoneNumber ?? ''),
      link: 'tel:' + application.phoneNumber,
    },
    {
      title: 'Netfang',
      content: application.email,
      link: 'mailto:' + application.email,
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
      title: 'Athugasemd',
      content: application.formComment ? '' : 'Engin athugasemd',
      other: application.formComment,
    },
  ]
}

export const getApplicantMoreInfo = (application: Application) => {
  return [
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
  ]
}

export const getNationalRegistryInfo = (application: Application) => {
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
      title: 'Ríkisfang',
      content: 'Ísland',
    },
    {
      title: 'Aldur',
      content: calcAge(application.nationalId) + ' ára',
    },
  ]
}

export const getApplicantSpouse = (application: Application) => {
  return [
    {
      title: 'Nafn',
      content: application.spouseName,
    },
    {
      title: 'Kennitala',
      content: application.spouseNationalId
        ? formatNationalId(application.spouseNationalId)
        : '',
    },
    {
      title: 'Sími',
      content: formatPhoneNumber(application.spousePhoneNumber ?? ''),
      link: 'tel:' + application.spousePhoneNumber,
    },
    {
      title: 'Netfang',
      content: application.spouseEmail,
      link: 'mailto:' + application.spouseEmail,
    },
    {
      title: 'Athugasemd',
      content: application.spouseFormComment ? '' : 'Engin athugasemd',
      other: application.spouseFormComment,
    },
  ]
}

export const getDirectTaxPayments = (directTaxPayments: DirectTaxPayment[]) => {
  const totalSalary = directTaxPayments.reduce(
    (n, { totalSalary }) => n + totalSalary,
    0,
  )

  return [
    {
      title: 'Samtals heildarlaun',
      content: totalSalary.toLocaleString('de-DE'),
    },
    {
      title: 'Meðaltal',
      content: Math.floor(
        totalSalary / directTaxPayments.length,
      ).toLocaleString('de-DE'),
    },
    {
      title: 'Persónuafsláttur meðaltal',
      content: (
        directTaxPayments.reduce(
          (n, { personalAllowance }) => n + personalAllowance,
          0,
        ) / directTaxPayments.length
      ).toLocaleString('de-DE'),
    },
    {
      title: 'Samtals staðgreiðsla',
      content: directTaxPayments
        .reduce((n, { withheldAtSource }) => n + withheldAtSource, 0)
        .toLocaleString('de-DE'),
    },
  ]
}
