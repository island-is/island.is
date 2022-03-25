import format from 'date-fns/format'

import { Message } from '@island.is/email-service'

import { EmailTemplateGenerator } from '../../../../types'
import { pathToAsset } from '../announcement-of-death-utils'

//TODO: use templates for useful things ins the announcement of death applications
export const generateTestEmail: EmailTemplateGenerator = (props): Message => {
  const {
    application,
    options: { email },
  } = props

  const emailSubject = `Andlátstilkynningu lokið af hönd (kt. ${application.applicant}) `
  const subject = `Andlátstilkynning`

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: 'Sýslu maður',
        address: 'sysla@kurte.is',
      },
    ],
    subject: emailSubject,
    template: {
      title: subject,
      body: [
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
            copy: `Þú hefur samþykkt andlátstilkynningu fyrir kt. ${
              JSON.stringify(application.externalData) ?? 'bingo'
            } um fæðingarorlof.`,
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `Athugaðu að þetta er stafræn pappírslaus umsókn. Við viljum því biðja þig að tryggja að staðfestingin komist í réttar hendur.`,
          },
        },
        {
          component: 'Copy',
          context: { copy: 'Kærar þakkir' },
        },
      ],
    },
  }
}
