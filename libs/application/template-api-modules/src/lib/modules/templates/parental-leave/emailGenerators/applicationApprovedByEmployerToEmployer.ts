import get from 'lodash/get'
import format from 'date-fns/format'

import { Message } from '@island.is/email-service'

import {
  getApplicationAnswers,
  Period,
  getApplicationExternalData,
} from '@island.is/application/templates/parental-leave'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { pathToAsset } from '../parental-leave.utils'
import { dateFormat } from '@island.is/shared/constants'
import { NO } from '@island.is/application/core'

export type EmployerRejectedToEmployerEmail = (
  props: EmailTemplateGeneratorProps,
  senderName?: string,
  senderEmail?: string,
) => Message

type EmailToType = {
  name: string
  address: string
}

// TODO handle translations
export const generateApplicationApprovedByEmployerToEmployerEmail: EmployerRejectedToEmployerEmail =
  (props): Message => {
    const {
      application,
      options: { email },
    } = props

    const { employers } = getApplicationAnswers(application.answers)
    const employersArray: EmailToType[] = []

    employers?.forEach((e) => {
      if (e.stillEmployed === NO) {
        return
      }
      employersArray.push({
        name: '',
        address: e.email,
      })
    })

    const periods = get(application.answers, 'periods') as unknown as Period[]
    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )

    const emailSubject = `Samþykkt umsókn um fæðingarorlof (${applicantName} kt. ${application.applicant}) - Vinsamlegast áframsendið til launadeildar`
    const subject = `Þú samþykktir umsókn um fæðingarorlof`

    const periodStartFromDateOfBirth =
      periods.length && periods[0]?.firstPeriodStart === 'actualDateOfBirth'

    const actualDateOfBirthCopy = periodStartFromDateOfBirth
      ? 'Athugið að þetta er áætlaður upphafsdagur fæðingarorlofstímabilsins. Þetta gæti breyst eftir raunverulegum fæðingardegi.'
      : ''

    return {
      from: {
        name: email.sender,
        address: email.address,
      },
      to: employersArray,
      subject: emailSubject,
      template: {
        title: subject,
        body: [
          {
            component: 'Image',
            context: {
              src: pathToAsset('logo.jpg'),
              alt: 'Vinnumálastofnun merki',
            },
          },
          {
            component: 'Image',
            context: {
              src: pathToAsset('child.jpg'),
              alt: 'Barn myndskreyting',
            },
          },
          { component: 'Heading', context: { copy: subject } },
          { component: 'Copy', context: { copy: 'Góðan dag.' } },
          {
            component: 'Copy',
            context: {
              copy: `Þú hefur samþykkt umsókn fyrir ${applicantName} kt. ${application.applicant} um fæðingarorlof.`,
            },
          },
          {
            component: 'Copy',
            context: {
              copy: `${
                periods.length === 1 ? 'Tímabilið' : 'Tímabilin'
              } sem þú hefur samþykkt ${periods.length === 1 ? 'er' : 'eru'}:`,
            },
          },
          {
            component: 'Copy',
            context: {
              copy: periods
                .map((period) => {
                  if (!period) return ''
                  if (period.firstPeriodStart === 'actualDateOfBirth') {
                    return `${format(
                      new Date(period.startDate),
                      dateFormat.is,
                    )} til ${format(
                      new Date(period.endDate),
                      dateFormat.is,
                    )}<br/>
                  ( Fæðingadagur til ${format(
                    new Date(period.endDate),
                    dateFormat.is,
                  )} )`
                  }

                  return `${format(
                    new Date(period.startDate),
                    dateFormat.is,
                  )} til ${format(new Date(period.endDate), dateFormat.is)}`
                })
                .join('<br/>'),
            },
          },
          {
            component: 'Copy',
            context: {
              copy: actualDateOfBirthCopy,
            },
          },
          {
            component: 'Copy',
            context: {
              copy: `Athugaðu að þetta er stafræn pappírslaus umsókn. Við viljum því biðja þig að tryggja að staðfestingin komist í réttar hendur og t.a.m. áframsenda á launadeild.`,
            },
          },
          {
            component: 'Copy',
            context: {
              copy: 'Kærar þakkir,<br/>Starfsfólk Fæðingarorlofssjóðs',
            },
          },
        ],
      },
    }
  }
