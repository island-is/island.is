import { dedent } from 'ts-dedent'
import get from 'lodash/get'
import { Buffer } from 'exceljs'
import { EmailTemplateGenerator } from '../../../../types'
import { Attachment } from 'nodemailer/lib/mailer'

export const generateSendApplicationEmail = (
  signatureExcelFileBuffer: Buffer,
): EmailTemplateGenerator => (props) => {
  const { application } = props
  const destinationEmail = 's@kogk.is'

  const partyLetter = get(application.answers, 'partyLetter')
  const partyName = get(application.answers, 'partyName')
  const selectedNationalId = get(application.answers, 'selectedNationalId')
  const applicantEmail = get(application.answers, 'applicantEmail')
  const applicantNationalId = application.applicant
  const applicantName = get(
    application.externalData,
    'nationalRegistry.fullName',
  )

  const subject = `Umsókn um listabókstaf - ${application.id}`
  const body = dedent(`
    Listabókstafur: ${partyLetter}
    Nafn flokks: ${partyName}
    Kennitala framboðs: ${selectedNationalId}

    Umsækjandi: ${applicantName}
    Kennitala umsækjanda: ${applicantNationalId}
    Netfang: ${applicantEmail}
    
    (Athugið að meðmælendur eru í áhengdu excel skjali)
  `)

  const attachments = [
    {
      filename: 'signatures.xlsx',
      content: signatureExcelFileBuffer,
    },
  ] as Attachment[]

  return {
    from: {
      name: 'Devland.is',
      address: 'development@island.is',
    },
    to: [
      {
        name: '',
        address: destinationEmail,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
    attachments,
  }
}
