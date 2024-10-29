import {
  ApplicationState,
  calcAge,
  calcDifferenceInDate,
  Employment,
  formatNationalId,
  formatPhoneNumber,
  getEmploymentStatus,
  getHomeCircumstances,
  getMonth,
  getState,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationModel } from '../modules/application'
import format from 'date-fns/format'

export const getHeader = (created: Date, state: ApplicationState) => {
  const applicationState = getState[state]
  const applicationCreated = created.toISOString()

  const ageOfApplication = `Aldur umsóknar: ${calcDifferenceInDate(
    applicationCreated,
  )}`

  return {
    applicationState,
    applicationCreated,
    ageOfApplication,
  }
}

export const getApplicationInfo = (application: ApplicationModel) => {
  return [
    {
      title: 'Dagsetning umsóknar',
      content: format(application.created, 'dd.MM.y  · kk:mm'),
    },
    {
      title: 'Fyrir tímabilið',
      content:
        getMonth(application.appliedDate.getMonth()) +
        format(application.appliedDate, ' y'),
    },
    application.state === ApplicationState.APPROVED && {
      title: 'Samþykkt aðstoð: ',
      content: `${application.amount[0].finalAmount.toLocaleString(
        'de-DE',
      )} kr.`,
    },
  ].filter(Boolean)
}

const formatBankNumber = (
  bankNumber?: string,
  ledger?: string,
  accountNumber?: string,
) => {
  return `${bankNumber}-${ledger}-${accountNumber}`
}

export const getApplicant = (application: ApplicationModel) => {
  return [
    {
      title: 'Nafn',
      content: application.name,
    },
    {
      title: 'Kennitala',
      content: formatNationalId(application.nationalId),
    },
    {
      title: 'Sími',
      content: formatPhoneNumber(application.phoneNumber ?? ''),
    },
    {
      title: 'Netfang',
      content: application.email,
    },

    {
      title: 'Bankareikningur',
      content: formatBankNumber(
        application.bankNumber,
        application.ledger,
        application.accountNumber,
      ),
    },
    {
      title: 'Nota persónuafslátt',
      content: application.usePersonalTaxCredit ? 'Já' : 'Nei',
    },
  ]
}

export const getApplicantMoreInfo = (application: ApplicationModel) => {
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
    application.homeCircumstancesCustom && {
      title: 'Búsetuform athugasemd',
      content: application.homeCircumstancesCustom,
    },
    application.employmentCustom && {
      title: 'Atvinnu athugasemd',
      content: application.employmentCustom,
    },
  ].filter(Boolean)
}

export const getNationalRegistryInfo = (application: ApplicationModel) => {
  return [
    {
      title: 'Lögheimili',
      content: application.streetName ?? '',
    },
    {
      title: 'Póstnúmer',
      content: application.postalCode ?? '',
    },
    {
      title: 'Sveitarfélag',
      content: application.city ?? '',
    },
    {
      title: 'Ríkisfang',
      content: 'Ísland',
    },
    {
      title: 'Maki',
      content: application.spouseNationalId ? 'Já' : 'Nei',
    },
    {
      title: 'Aldur',
      content: calcAge(application.nationalId) + ' ára',
    },
  ]
}

export const getApplicantSpouse = (application: ApplicationModel) => {
  return [
    {
      title: 'Nafn',
      content: application.spouseName ?? '',
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
    },
    {
      title: 'Netfang',
      content: application.spouseEmail ?? '',
    },
  ]
}

export const getChildrenInfo = (application: ApplicationModel) => {
  if (!application.children) {
    return []
  }

  const allChildren = application.children.flatMap((child) => {
    return [
      {
        title: 'Nafn',
        content: child.name ?? '',
      },
      {
        title: 'Kennitala',
        content: formatNationalId(child.nationalId),
      },
      {
        title: 'Aldur',
        content: calcAge(child.nationalId) + ' ára',
      },
      {
        title: 'Skólastofnun',
        content: child.school ?? '',
      },
      {
        title: 'Býr hjá umsækjanda?',
        content: `${child.livesWithApplicant ? 'Já' : 'Nei'}`,
      },
      {
        title: 'Býr hjá báðum foreldrum?',
        content: `${child.livesWithBothParents ? 'Já' : 'Nei'}`,
      },
    ]
  })

  return allChildren
}
