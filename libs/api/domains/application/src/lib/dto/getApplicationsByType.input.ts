import { Field, InputType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'
import { ApplicationTypeIdEnum } from '../../../gen/fetch'

@InputType()
export class GetApplicationsByTypeInput {
  @Field((type) => ApplicationTypeIdEnum)
  @IsEnum(ApplicationTypeIdEnum)
  typeId: ApplicationTypeIdEnum
}
