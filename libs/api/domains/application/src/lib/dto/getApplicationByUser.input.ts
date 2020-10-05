import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApplicationResponseDtoTypeIdEnum } from '../../../gen/fetch/models/ApplicationResponseDto'

@InputType()
export class GetApplicationsByUserInput {
  @Field(() => String)
  @IsString()
  nationalRegistryId!: string

  @Field(() => ApplicationResponseDtoTypeIdEnum, { nullable: true })
  @IsEnum(ApplicationResponseDtoTypeIdEnum)
  @IsOptional()
  typeId?: ApplicationResponseDtoTypeIdEnum
}
