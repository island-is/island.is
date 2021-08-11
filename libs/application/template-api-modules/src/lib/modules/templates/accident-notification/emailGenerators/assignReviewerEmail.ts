import get from 'lodash/get'
import { AssignmentEmailTemplateGenerator } from '../../../../types'
import { Message } from '@island.is/email-service'
import { utils } from '@island.is/application/templates/accident-notification'

export const generateAssignReviewerEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
): Message => {
  const {
    application,
    options: { email },
  } = props

  const workplaceData = utils.getWorkplaceData(application.answers)
  const recipientEmail = workplaceData?.info.email
  const subject = 'Yfirferð tilkynningar slyss'
  const title = 'Tilkynning um slys'

  if (!recipientEmail) throw new Error('Recipient email was undefined')

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [{ name: '', address: recipientEmail }],
    subject,
    template: {
      title,
      body: [
        {
          component: 'Heading',
          context: { copy: title },
        },
        { component: 'Copy', context: { copy: 'Góðan dag.' } },
        {
          component: 'Copy',
          context: {
            copy:
              'Tilkynning um slys hefur borist Sjúkratryggingum Íslands sem tengist stofnun eða félagi þar sem þú varst skráður sem forsvarsmaður.',
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `Ef þú áttir von á þessum tölvupósti þá getur þú smellt á takkann hér fyrir neðan.`,
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Yfirfara umsókn',
            href: assignLink,
          },
        },
        { component: 'Copy', context: { copy: 'Með kveðju,' } },
        { component: 'Copy', context: { copy: 'Sjúkratryggingar Íslands' } },
      ],
    },
  }
}
