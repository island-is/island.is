import { AssignmentEmailTemplateGenerator } from '../../../../types'
import { Message } from '@island.is/email-service'
import { utils } from '@island.is/application/templates/accident-notification'
import dedent from 'ts-dedent'
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
    html: body,
  }
}
