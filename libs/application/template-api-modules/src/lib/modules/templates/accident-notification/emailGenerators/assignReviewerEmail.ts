import { utils } from '@island.is/application/templates/accident-notification'
import { Message } from '@island.is/email-service'
import { AssignmentEmailTemplateGenerator } from '../../../../types'
import { pathToAsset } from '../accident-notification.utils'

export const generateAssignReviewerEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
): Message => {
  const {
    application,
    options: { email },
  } = props

  const isReportingOnBehalfOfEmployee = utils.isReportingOnBehalfOfEmployee(
    application.answers,
  )
  const workplaceData = utils.getWorkplaceData(application.answers)
  const injuredPersonInformation = utils.getInjuredPersonInformation(
    application.answers,
  )
  const recipientEmail = isReportingOnBehalfOfEmployee
    ? injuredPersonInformation?.email
    : workplaceData?.info.email
  const recipientName = isReportingOnBehalfOfEmployee
    ? injuredPersonInformation?.name
    : workplaceData?.info.name
  const subject = 'Tilkynning um slys'

  if (!recipientEmail) throw new Error('Recipient email was undefined')

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [{ name: recipientName || '', address: recipientEmail }],
    subject,
    template: {
      title: subject,
      body: [
        {
          component: 'Image',
          context: {
            src: pathToAsset('logo.jpg'),
            alt: 'Ísland.is logo',
          },
        },
        {
          component: 'Image',
          context: {
            src: pathToAsset('manWithBabyIllustration.jpg'),
            alt: 'Maður með barn myndskreyting',
          },
        },
        {
          component: 'Heading',
          context: { copy: subject },
        },
        {
          component: 'Subtitle',
          context: {
            copy: 'Skjalanúmer',
            // TODO: Need to get application id from service
            application: '#13568651',
          },
        },
        {
          component: 'Copy',
          context: {
            copy: isReportingOnBehalfOfEmployee
              ? 'Tilkynning um slys hefur borist Sjúkratryggingum Íslands þar sem þú ert skráður sem hinn slasaði.  Hægt er að fara yfir tilkynninguna á íslands.is eða með því að smella á hlekkinn hér að neðan.'
              : 'Tilkynning um slys hefur borist Sjúkratryggingum Íslands sem tengist stofnun eða félagi þar sem þú varst skráður sem forsvarsmaður.  Hægt er að fara yfir tilkynninguna á íslands.is eða með því að smella á hlekkinn hér að neðan.',
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Skoða tilkynningu',
            href: assignLink,
          },
        },
      ],
    },
  }
}
