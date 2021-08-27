import get from 'lodash/get'
import format from 'date-fns/format'

import { Message } from '@island.is/email-service'

import type { Period } from '@island.is/application/templates/parental-leave'
import { EmailTemplateGenerator } from '../../../../types'
import { pathToAsset } from '../parental-leave.utils'
import { dateFormat } from '@island.is/shared/constants'

// TODO handle translations
export const generateApplicationApprovedByEmployerToEmployerEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email },
  } = props

  const employerEmail = get(application.answers, 'employer.email') as string
  const periods = (get(application.answers, 'periods') as unknown) as Period[]

  const emailSubject = `Þú hefur samþykkt umsókn um fæðingarorlof (kt. starfsmanns ${application.applicant})`
  const subject = `Þú samþykktir umsókn um fæðingarorlof`

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: employerEmail,
      },
    ],
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
            copy:
              'Þessi tölvupóstur er staðfesting á því að þú hafir samþykkt umsókn um fæðingarorlof.',
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `Umsækjandi með kennitöluna ${
              application.applicant
            } sótti um fæðingarorlof fyrir ${
              periods.length === 1 ? 'tímabilið' : 'tímabilin'
            }:`,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: periods
              .map(
                (period) =>
                  `${format(
                    new Date(period.startDate),
                    dateFormat.is,
                  )} til ${format(new Date(period.endDate), dateFormat.is)}`,
              )
              .join('<br/>'),
          },
        },
        { component: 'Copy', context: { copy: 'Með kveðju,' } },
        { component: 'Copy', context: { copy: 'Fæðingarorlofssjóður' } },
      ],
    },
  }
}
