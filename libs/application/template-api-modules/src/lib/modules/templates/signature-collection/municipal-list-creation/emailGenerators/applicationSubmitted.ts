import { EmailTemplateGenerator } from '../../../../../types'
import { OwnerInput } from '@island.is/clients/signature-collection'
import { Message } from '@island.is/email-service'
import { CreateListSchema } from '@island.is/application/templates/signature-collection/municipal-list-creation'

export const generateApplicationSubmittedEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email },
  } = props

  const answers = application.answers as CreateListSchema
  const owner: OwnerInput = answers.applicant

  const subject =
    'Ný meðmælasöfnun fyrir sveitarstjórnarkosningar hefur verið stofnuð'

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: 'Landskjörstjórn',
        address: 'postur@landskjorstjorn.is',
      },
      {
        name: 'Þjóðskrá',
        address: 'kosningar@skra.is',
      },
    ],
    subject,
    template: {
      title: subject,
      body: [
        { component: 'Heading', context: { copy: subject } },
        {
          component: 'Copy',
          context: {
            copy: `${owner.name} Kt: ${owner.nationalId} hefur stofnað lista fyrir ${answers.list.name} til meðmælasöfnunar fyrir sveitarstjórnarkosningar`,
            align: 'left',
          },
        },
        {
          component: 'Copy',
          context: {
            copy: `Samskiptaupplýsingar framboðs. Sími ${owner.phone} Netfang: ${owner.email} `,
            align: 'left',
          },
        },
      ],
    },
  }
}
