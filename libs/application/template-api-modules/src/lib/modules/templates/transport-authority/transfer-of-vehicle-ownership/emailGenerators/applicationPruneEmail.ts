import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { Message } from '@island.is/email-service'
import { EmailTemplateGeneratorProps } from '../../../../../types'
import { EmailRecipient } from '../types'
import {
  getRoleNameById,
  getRecipients,
  getAllRoles,
} from '../transfer-of-vehicle-ownership.utils'
import { pathToAsset } from '../transfer-of-vehicle-ownership.utils'
import { ApplicationConfigurations } from '@island.is/application/types'

export type ApplicationPruneEmail = (
  props: EmailTemplateGeneratorProps,
  recipient: EmailRecipient,
) => Message

export const generateApplicationPruneEmail: ApplicationPruneEmail = (
  props,
  recipient,
): Message => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props
  const answers = application.answers as TransferOfVehicleOwnershipAnswers
  const permno = answers?.vehicle?.plate
  const notApprovedByList = getRecipients(answers, getAllRoles()).filter(
    (x) => x.approved !== true,
  )

  if (!recipient.email) throw new Error('Recipient email was undefined')
  if (!permno) throw new Error('Permno was undefined')

  const subject = 'Tilkynning um eigendaskipti - Umsókn fallin á tíma'
  const notApprovedByListStr = notApprovedByList
    .map(
      (notApprovedBy) =>
        `<li><p>${notApprovedBy.name}, kt. ${
          notApprovedBy.ssn
        } (${getRoleNameById(notApprovedBy.role)})</p></li>`,
    )
    .join(',')

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
              `<span>Beiðni um eigendaskipti á ökutækinu ${permno} hefur verið felld niður þar sem eftirfarandi aðilar staðfestu ekki innan tímafrests:</span><br/>` +
              `<ul>${notApprovedByListStr}.</ul>` +
              `<span>Til þess að skrá eigendaskiptin rafrænt verður að byrja ferlið upp á nýtt á umsóknarvef island.is: island.is/umsoknir, ásamt því að allir aðilar þurfa að staðfesta rafrænt innan gefins tímafrests.</span><br/>` +
              `<span>Þessi tilkynning á aðeins við um rafræna umsókn af umsóknarvef island.is en ekki um eigendaskipti sem skilað hefur verið inn til Samgöngustofu á pappír.</span><br/>` +
              `<span>Vinsamlegast hafið samband við Þjónustuver Samgöngustofu (afgreidsla@samgongustofa.is) ef nánari upplýsinga er þörf.</span>`,
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Skoða umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.DigitalTachographDriversCard.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}
