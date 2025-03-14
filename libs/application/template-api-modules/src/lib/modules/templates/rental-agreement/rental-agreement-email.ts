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


  console.log('application inni í email ***===1', application)
  console.log('tenantEmails ***===2', tenantEmails)
  console.log('Landlords ***===3', landlords)

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
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}