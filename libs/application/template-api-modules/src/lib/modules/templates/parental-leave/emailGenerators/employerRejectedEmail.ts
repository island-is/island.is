import get from 'lodash/get'

import { ApplicationConfigurations } from '@island.is/application/core'

import { EmailTemplateGenerator } from '../../../../types'
import { pathToAsset } from '../parental-leave.utils'

// TODO handle translations
export const generateOtherParentRejected: EmailTemplateGenerator = (props) => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const to =
    get(application.answers, 'applicant.email') ||
    get(application.externalData, 'userProfile.data.email')
  const subject = 'Beiðni um tilfærslu réttinda hafnað um fæðingarorlof'

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: to as string,
      },
    ],
    subject,
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
              'Beiðni þinni um tilfærslu réttinda hefur verið hafnað af hinu foreldrinu.',
          },
        },
        {
          component: 'Copy',
          context: {
            copy:
              'TEST EMPLOYER REJ...Til þess að skoða umsókn þína getur þú smellt á takkann hér fyrir neðan.',
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Opna umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}
