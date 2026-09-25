import { Field, InputType, Int } from '@nestjs/graphql'
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator'

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

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  treatmentId?: string

  @Field({
    nullable: true,
    description:
      'Omitted only for a recipient whose allowsCustomTitle is true.',
  })
  @IsString()
  @IsOptional()
  patientInitiatedTypeCode?: string

  @Field({
    nullable: true,
    description: 'Required when patientInitiatedTypeCode is omitted.',
  })
  @ValidateIf((input) => !input.patientInitiatedTypeCode || !!input.title)
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title?: string

  @Field()
  @IsString()
  @IsNotEmpty()
  messageTextContent!: string
}
