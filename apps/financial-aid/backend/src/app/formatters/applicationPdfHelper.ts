import {
  ApplicationState,
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
import { rejections } from 'winston'

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
      text: format(application.created, 'dd.MM.y  · kk:mm'),
    },
    {
      title: 'Fyrir tímabilið',
      text:
        getMonth(application.appliedDate.getMonth()) +
        format(application.appliedDate, ' y'),
    },
    application.state === ApplicationState.APPROVED
      ? {
          title: 'Samþykkt aðstoð: ',
          text: `${application.amount.finalAmount.toLocaleString('de-DE')} kr.`,
        }
      : {
          title: '',
          text: '',
        },
  ]
}

export const getApplicationRejection = (rejection: string) => {
  const rejectionArray = []

  // Step 1: Split by <br><br> for paragraphs
  const paragraphs = rejection.split('<br><br>')

  paragraphs.forEach((paragraph) => {
    // Step 2: Handle bold text within <b> tags
    if (paragraph.includes('<b>')) {
      // Find and split the paragraph by <b> tags
      const parts = paragraph.split(/<\/?b>/) // Split on <b> and </b>
      parts.forEach((part, index) => {
        if (index % 2 === 1) {
          // Odd index means it's bold
          rejectionArray.push({ text: part, bold: true })
        } else {
          rejectionArray.push({ text: part, bold: false })
        }
      })
    } else if (paragraph.includes('<a href="mailto:')) {
      // Step 3: Handle email link, just extract and append the email
      rejectionArray.push({
        text: `Tölvupóstur`,
        bold: false,
        color: 'blue',
      })
    } else {
      // Normal paragraph without <b> or <a>, push as regular text
      rejectionArray.push({ text: paragraph, bold: false })
    }

    // Add a line break after each paragraph
    rejectionArray.push({ text: '', bold: false })
  })
  return rejectionArray
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
