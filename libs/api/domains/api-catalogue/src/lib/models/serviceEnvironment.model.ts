import { Field, ObjectType } from '@nestjs/graphql'
import { IsArray, IsEnum } from 'class-validator'
import { Environment } from '@island.is/api-catalogue/consts'
import { ServiceDetail } from './serviceDetail.model'
import { ServiceEnvironment as IServiceEnvironment } from '@island.is/api-catalogue/types'

@ObjectType()
export class ServiceEnvironment implements IServiceEnvironment {
  @Field(() => Environment)
  @IsEnum(Environment)
  environment!: Environment

  @Field(() => [ServiceDetail])
  @IsArray()
  details!: Array<ServiceDetail>
}
