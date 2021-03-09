import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsEnum, IsOptional } from 'class-validator'

import { ApplicationResponseDtoTypeIdEnum } from '../../../gen/fetch/models/ApplicationResponseDto'

@InputType()
export class ApplicationApplicationsInput {
  @Field(() => ApplicationResponseDtoTypeIdEnum, { nullable: true })
  @IsEnum(ApplicationResponseDtoTypeIdEnum)
  @IsOptional()
  typeId?: ApplicationResponseDtoTypeIdEnum

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean
}
