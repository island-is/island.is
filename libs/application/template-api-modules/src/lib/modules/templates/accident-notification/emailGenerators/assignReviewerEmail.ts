import { utils } from '@island.is/application/templates/accident-notification'
import { Message } from '@island.is/email-service'
import dedent from 'ts-dedent'
import { AssignmentEmailTemplateGenerator } from '../../../../types'
import { pathToAsset } from '../accident-notification.utils'
import { overviewTemplate } from './overviewTemplate'

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
  const subject = 'Tilkynning um slys'

  if (!recipientEmail) throw new Error('Recipient email was undefined')

  const overview = overviewTemplate(application)

  const body = dedent(`
    <h1>${subject}</h1> </br>
    <p>Tilkynning um slys hefur borist Sjúkratryggingum Íslands sem tengist stofnun eða félagi þar sem þú varst skráður forsvarsmaður.</p> </br>
    ${overview} </br>

    <p>Vinsamlegast smelltu á hlekkinn hér að neðan til að yfirfara tilkynninguna</p>
    <p>Opna tilkynningu: <a href="${assignLink}">${assignLink}</a></p>
  `)

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [{ name: '', address: recipientEmail }],
    subject,
    // html: body,
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
            // Need to get application id from service
            application: '#13568651',
          },
        },
        {
          component: 'Copy',
          context: {
            copy:
              'Tilkynning um slys hefur borist Sjúkratryggingum Íslands sem tengist stofnun eða félagi þar sem þú varst skráður sem forsvarsmaður.  Hægt er að fara yfir tilkynninguna á íslands.is eða með því að smella á hlekkinn hér að neðan.',
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
