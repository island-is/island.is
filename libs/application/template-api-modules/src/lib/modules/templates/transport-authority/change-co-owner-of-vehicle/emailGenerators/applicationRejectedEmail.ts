import { ChangeCoOwnerOfVehicleAnswers } from '@island.is/application/templates/transport-authority/change-co-owner-of-vehicle'
import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'
import { getRoleNameById } from '../change-co-owner-of-vehicle.utils'
import { pathToAsset } from '../change-co-owner-of-vehicle.utils'
import { ApplicationConfigurations } from '@island.is/application/types'

export type ApplicationRejectedEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
  rejectedBy: EmailRecipient | undefined,
) => Message

export const generateApplicationRejectedEmail: ApplicationRejectedEmail = (
  props,
  recipient,
  rejectedBy,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props
  const answers = application.answers as ChangeCoOwnerOfVehicleAnswers
  const permno = answers?.pickVehicle?.plate

  if (!recipient.email) throw new Error('Recipient email was undefined')
  if (!permno) throw new Error('Permno was undefined')
  if (!rejectedBy?.ssn) throw new Error('Rejected by ssn was undefined')

  const subject = 'Tilkynning um breytingu á meðeigendum - Umsókn afturkölluð'
  const rejectedByStr = `${rejectedBy.name}, kt. ${
    rejectedBy.ssn
  } (${getRoleNameById(rejectedBy.role)})`

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [{ name: recipient.name, address: recipient.email }],
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
            src: pathToAsset('computerIllustration.jpg'),
            alt: 'Kaffi við skjá myndskreyting',
          },
        },
        {
          component: 'Heading',
          context: { copy: subject },
        },
        {
          component: 'Copy',
          context: {
            copy:
              `<span>Góðan dag,</span><br/><br/>` +
              `<span>Beiðni um breytingu á meðeigendum á ökutækinu ${permno} hefur verið afturkölluð þar sem eftirfarandi aðilar staðfestu ekki:</span><br/>` +
              `<ul><li><p>${rejectedByStr}</p></li></ul>` +
              `<span>Til þess að skrá breytingu á meðeigendum rafrænt verður að byrja ferlið að upp á nýtt á umsóknarvef island.is: island.is/umsoknir, ásamt því að allir aðilar þurfa að staðfesta rafrænt innan gefins tímafrests.</span><br/>` +
              `<span>Þessi tilkynning á aðeins við um rafræna umsókn af umsóknarvef island.is en ekki um umsókn sem skilað hefur verið inn til Samgöngustofu á pappír.</span><br/>` +
              `<span>Vinsamlegast hafið samband við Þjónustuver Samgöngustofu (afgreidsla@samgongustofa.is) ef nánari upplýsinga er þörf.</span>`,
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Skoða umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.ChangeCoOwnerOfVehicle.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}
