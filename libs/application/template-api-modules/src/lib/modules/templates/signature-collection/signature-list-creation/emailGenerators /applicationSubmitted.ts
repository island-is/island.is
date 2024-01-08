import { EmailTemplateGenerator } from '../../../../../types'
import { CreateListSchema } from '@island.is/application/templates/signature-collection/signature-list-creation'
import { OwnerInput } from '@island.is/clients/signature-collection'
import { SignatureCollection } from '../types'
import { Message, Body } from '@island.is/email-service'

export const generateApplicationSubmittedEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email },
  } = props

  // Temp until LKS has email ready
  const adminEmail = 'alex@juni'
  const answers = application.answers as CreateListSchema

  const owner: OwnerInput = answers.applicant

  const currentCollection: SignatureCollection = application.externalData
    .currentCollection?.data as SignatureCollection

  const subject = 'Nýir meðmælasöfnunar listar stofnaðir'
  const lists: Body[] = currentCollection.areas.map((area) => {
    return {
      component: 'Copy',
      context: { copy: `${owner.name} - ${area.name}` },
    }
  })

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: adminEmail as string,
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
            copy: `${owner.name} Kt: ${owner.nationalId} hefur stofnað eftirfarandi lista til meðmælasöfnunar:`,
          },
        },
        ...lists,
      ],
    },
  }
}
