import {
  Employment,
  formatNationalId,
  formatPhoneNumber,
  getEmploymentStatus,
  getHomeCircumstances,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationModel } from '../modules/application'

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
  ]
}
