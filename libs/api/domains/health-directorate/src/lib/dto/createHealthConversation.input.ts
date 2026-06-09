import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

@InputType()
export class HealthDirectorateCreateConversationInput {
  @Field({
    description:
      'Hekla node ID of the recipient. Obtained from the recipient list.',
  })
  @IsString()
  @IsNotEmpty()
  nodeId!: string

  @Field(() => Int, {
    description:
      'Hekla group ID of the recipient provider. Obtained from the recipient list.',
  })
  @IsInt()
  groupId!: number

  @Field()
  @IsString()
  @IsNotEmpty()
  patientInitiatedTypeCode!: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string

  @Field()
  @IsString()
  @IsNotEmpty()
  messageTextContent!: string
}
