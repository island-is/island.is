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
  const subject = 'Beiðni þín um tilfærslu réttinda hafnað'

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
            src: pathToAsset('reject.jpg'),
            alt: 'Barn myndskreyting',
          },
        },
        { component: 'Heading', context: { copy: subject } },
        { component: 'Copy', context: { copy: 'Góðan dag / Good day,' } },
        {
          component: 'Copy',
          context: {
            copy:
              'Hitt foreldrið hefur hafnað beiðni þinni um yfirfærslu á réttindum. Þú þarft því að breyta umsókn þinni.',
          },
        },
        {
          component: 'Copy',
          context: {
            copy:
              'The other parent has denied your request to transfer rights. You therefore need to modify your application.',
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
