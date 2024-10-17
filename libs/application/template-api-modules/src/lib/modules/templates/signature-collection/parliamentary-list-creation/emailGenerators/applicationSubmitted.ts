import { EmailTemplateGenerator } from '../../../../../types'
import { OwnerInput } from '@island.is/clients/signature-collection'
import { Message, Body } from '@island.is/email-service'
import { CreateListSchema } from '@island.is/application/templates/signature-collection/parliamentary-list-creation'

export const generateApplicationSubmittedEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email },
  } = props

  const answers = application.answers as CreateListSchema
  const owner: OwnerInput = answers.applicant

  const subject = 'Ný meðmælasöfnun fyrir alþingiskosningar hefur verið stofnuð'
  const areas: Body[] = answers.constituency.map((c) => {
    return {
      component: 'Copy',
      context: { copy: `${c.split('|')[1]}` },
      align: 'left',
    }
  })

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
            copy: `${owner.name} Kt: ${owner.nationalId} hefur stofnað lista fyrir flokkinn ${answers.list.name} með listabókstaf ${answers.list.letter} til meðmælasöfnunar fyrir alþingiskosningar í eftirfarandi kjördæmum:`,
            align: 'left',
          },
        },
        ...areas,
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
