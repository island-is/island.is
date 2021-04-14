import { getSlugFromType } from '@island.is/application/core'
import get from 'lodash/get'
import { EmailTemplateGenerator } from '../../../../types'

export const transferRequestedEmail: EmailTemplateGenerator = (props) => {
  const {
    application,
    options: { clientLocationOrigin },
  } = props
  const applicationSlug = getSlugFromType(application.typeId) as string
  const applicationLink = `${clientLocationOrigin}/${applicationSlug}/${application.id}`
  const email = get(application.answers, 'counterParty.email') as string
  const subject = 'Umsókn um breytt lögheimili barns'
  const body = `
        Borist hefur umsókn um breytt lögheimili barns.

        <a href=${applicationLink} target="_blank">Skoða umsókn</a>.
      `

  return {
    from: {
      name: 'Devland.is',
      address: 'development@island.is',
    },
    to: [
      {
        name: '',
        address: email,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
