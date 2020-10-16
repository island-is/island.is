import { Field, InputType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'
import { ApplicationResponseDtoTypeIdEnum } from '../../../gen/fetch/models/ApplicationResponseDto'

@InputType()
export class GetApplicationsByTypeInput {
  @Field((type) => ApplicationResponseDtoTypeIdEnum)
  @IsEnum(ApplicationResponseDtoTypeIdEnum)
  typeId: ApplicationResponseDtoTypeIdEnum
}
