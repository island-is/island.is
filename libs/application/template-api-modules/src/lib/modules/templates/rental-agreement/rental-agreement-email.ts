import { getValueViaPath } from '@island.is/application/core'
import { AttachmentEmailTemplateGenerator, EmailTemplateGenerator } from '../../../types'

export const generateRentalAgreementNotificationEmail: AttachmentEmailTemplateGenerator =
  (props) => {
    const {
      application,
      options: { email },
    } = props
    const subject = 'Hér er email'
    const body = `
  Hello
      `

    return {
      from: {
        name: 'Something',
        address: 'rakel@kolibri.is',
      },
      to: [
        {
          name: '',
          address: 'rakel@kolibri.is',
        },
      ],
      subject,
      html: `<p>${body
        .split('')
        .map((c) => (c === '\n' ? `<br />\n` : c))
        .join('')}</p>`,
      attachments: [
        {
          filename: `${application.id}.pdf`,
          encoding: 'binary',
        },
      ],
    }
  }

export const generateRentalAgreementEmail: EmailTemplateGenerator = (
  props,
) => {
  const {
    application,
    // options: { email },
  } = props

  // const applicantEmail = get(application.answers, 'person.email')

  
  const tenantEmails = (getValueViaPath(
    application.answers,
    'tenantInfo.table',
    [],
  ) as Array<{
    nationalIdWithName: { name: string }
    email: string
  }>).map((tenant) => tenant.email)
  
  const landlords = getValueViaPath(
    application.answers,
    'landlordInfo.table',
    [],
  ) as Array<{
    nationalIdWithName: { name: string }
    email: string
  }>
  
  console.log('tölvupóstur before ***===0a', application)

  const htmlSummaryForEmail = getValueViaPath(
    application.answers,
    'htmlSummary',
  ) as string;

  const subidubi = JSON.parse(htmlSummaryForEmail);

  const emailContent = subidubi.html; // Extract the HTML


  console.log('tölvupóstur ***===1a', application)
  console.log('tölvupóstur ***===2b', emailContent)
  // console.log('tenantEmails ***===2', tenantEmails)
  // console.log('Landlords ***===3', landlords)
  // console.log('Landlords ***===4 þetta er nýtT!!', landlords)

  // TODO translate using locale
  const subject ='Umsókn samþykkt: ReferenceTemplate'
  const body =`Góðan dag.

        Umsókn þín um ReferenceTemplate hefur verið samþykkt.

        Með kveðju,
        starfsfólk ReferenceTemplateStofnunarinnar
      `

  return {
    from: {
      name: "Prófa póst",
      address: "sonja@kolibri.is",
    },
    to: [
      {
        name: 'Sonja',
        address: "sonja@kolibri.is",
      },
    ],
    subject,
    html: emailContent
  }
}