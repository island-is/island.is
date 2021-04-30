import { getSlugFromType } from '@island.is/application/core'
import { CRCApplication } from '@island.is/application/templates/children-residence-change'
import { EmailTemplateGenerator } from '../../../../types'

export const transferRequestedEmail: EmailTemplateGenerator = (props) => {
  const application = (props.application as unknown) as CRCApplication
  const {
    options: { clientLocationOrigin },
  } = props
  const applicationSlug = getSlugFromType(application.typeId) as string
  const applicationLink = `${clientLocationOrigin}/${applicationSlug}/${application.id}`
  const subject = 'Umsókn um breytt lögheimili barns'
  const body = `
        ${application.externalData.nationalRegistry.data.fullName} hefur óskað eftir að þú undirritir samning um breytt lögheimili barns og meðlag.

        Samningurinn er tilbúinn til rafrænnar undirritunar á Island.is.

        <a href=${applicationLink} target="_blank">Opna umsókn</a>.
      `

  return {
    from: {
      name: process.env.EMAIL_FROM_NAME ?? '',
      address: process.env.EMAIL_FROM ?? 'development@island.is',
    },
    to: [
      {
        name: '',
        address: application.answers.counterParty.email,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
