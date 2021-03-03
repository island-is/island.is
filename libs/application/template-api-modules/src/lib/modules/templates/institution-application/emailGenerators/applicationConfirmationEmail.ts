import { dedent } from 'ts-dedent'
import get from 'lodash/get'
import { EmailTemplateGenerator } from '../../../../types'

export const generateConfirmationEmail: EmailTemplateGenerator = (props) => {
  const {
    application,
    options: { locale },
  } = props

  const institutionApplicant = get(application.answers, 'applicant.institution')
  const applicantEmail = get(application.answers, 'contact.email')

  const subject = `Umsókn þín fyrir ${institutionApplicant} hefur verið móttekin.`

  const body = dedent(`
        ${subject}
        Við munum nú fara yfir verkefnið og við sendum á þig svör innan tíðar.
        Við verðum í sambandi ef okkur vantar frekari upplýsingar.
        Ef þú þarft frekari upplýsingar þá getur þú haft samband í síma 847 3759 eða á netfangið island@island.is
      `)

  return {
    from: {
      name: 'Devland.is',
      address: 'development@island.is',
    },
    to: [
      {
        name: '',
        address: applicantEmail as string,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
