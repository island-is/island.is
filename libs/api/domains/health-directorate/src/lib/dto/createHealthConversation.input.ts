import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class HealthDirectorateCreateConversationInput {
  @Field({
    description:
      'Hekla node ID of the recipient. Obtained from the recipient list.',
  })
  nodeId!: string

  @Field(() => Int, {
    description:
      'Hekla group ID of the recipient provider. Obtained from the recipient list.',
  })
  groupId!: number

  @Field()
  patientInitiatedTypeCode!: string

  @Field({ nullable: true })
  title?: string

  @Field()
  messageTextContent!: string
}
