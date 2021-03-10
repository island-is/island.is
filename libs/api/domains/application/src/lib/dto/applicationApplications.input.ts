import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsEnum, IsOptional } from 'class-validator'

import {
  ApplicationControllerFindAllTypeIdEnum,
  ApplicationControllerFindAllStatusEnum,
} from '../../../gen/fetch'

registerEnumType(ApplicationControllerFindAllTypeIdEnum, {
  name: 'ApplicationControllerFindAllTypeIdEnum',
})

registerEnumType(ApplicationControllerFindAllStatusEnum, {
  name: 'ApplicationControllerFindAllStatusEnum',
})

@InputType()
export class ApplicationApplicationsInput {
  @Field(() => ApplicationControllerFindAllTypeIdEnum, { nullable: true })
  @IsEnum(ApplicationControllerFindAllTypeIdEnum)
  @IsOptional()
  typeId?: ApplicationControllerFindAllTypeIdEnum

  @Field(() => ApplicationControllerFindAllStatusEnum, { nullable: true })
  @IsEnum(ApplicationControllerFindAllStatusEnum)
  @IsOptional()
  status?: ApplicationControllerFindAllStatusEnum
}
