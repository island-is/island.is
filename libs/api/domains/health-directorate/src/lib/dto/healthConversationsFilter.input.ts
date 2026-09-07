import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { HealthConversationStatusFilterEnum } from '../models/enums'

@InputType()
export class HealthDirectorateHealthConversationsFilterInput {
  @Field(() => HealthConversationStatusFilterEnum, { nullable: true })
  @IsEnum(HealthConversationStatusFilterEnum)
  @IsOptional()
  status?: HealthConversationStatusFilterEnum

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  starred?: boolean
}
