import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApplicationTypeIdEnum } from '../../../gen/fetch'

@InputType()
export class GetApplicationsByUserInput {
  @Field(() => String)
  @IsString()
  nationalRegistryId!: string

  @Field(() => ApplicationTypeIdEnum, { nullable: true })
  @IsEnum(ApplicationTypeIdEnum)
  @IsOptional()
  typeId?: ApplicationTypeIdEnum
}
