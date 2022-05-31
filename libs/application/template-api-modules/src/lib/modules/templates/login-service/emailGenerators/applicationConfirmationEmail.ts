import { dedent } from 'ts-dedent'
import { EmailTemplateGeneratorProps } from '../../../../types'
import { applicationOverviewTemplate } from './applicationOverviewTemplate'
import { SendMailOptions } from 'nodemailer'
import { getValueViaPath } from '@island.is/application/core'

interface ConfirmationEmail {
  (
    props: EmailTemplateGeneratorProps,
    applicationSenderName: string,
    applicationSenderEmail: string,
  ): SendMailOptions
}

export const generateConfirmationEmail: ConfirmationEmail = (
  props,
  applicationSenderName,
  applicationSenderEmail,
) => {
  const { application } = props

  const name = getValueViaPath(application.answers, 'applicant.name')

  const contactEmail = getValueViaPath(
    application.answers,
    'applicant.responsiblePartyEmail',
  )
  const contactName = getValueViaPath(
    application.answers,
    'applicant.responsiblePartyName',
  )

  const subject = `Umsókn þín fyrir ${name} hefur verið móttekin.`
  const overview = applicationOverviewTemplate(application)

  const body = dedent(`
    <h2>Umsókn um innskráningarþjónustu móttekin</h2>
    <p>
      Við munum nú fara yfir verkefnið og við sendum á þig svör innan tíðar. </br>
      Við verðum í sambandi ef okkur vantar frekari upplýsingar. </br>
      Ef þú þarft frekari upplýsingar þá getur þú sent okkur tölvupóst á netfangið <a href="mailto:island@island.is">island@island.is</a> </br>
    </p>
    <h2>Yfirlit umsóknar</h2>
    ${overview}
  `)

  return {
    from: {
      name: applicationSenderName,
      address: applicationSenderEmail,
    },
    to: [
      {
        name: contactName as string,
        address: contactEmail as string,
      },
    ],
    subject,
    html: body,
  }
}
