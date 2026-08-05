import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString } from 'class-validator'

@InputType()
export class HealthDirectorateRenewalInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  nodeId?: string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  groupId?: number
}
