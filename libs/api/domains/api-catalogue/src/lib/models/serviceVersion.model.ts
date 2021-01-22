import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ServiceVersion as IServiceVersion } from '@island.is/api-catalogue/types'
import { IsObject, IsString } from 'class-validator'
import { ServiceDetail } from './serviceDetail.model'

@ObjectType()
export class ServiceVersion implements IServiceVersion {
  @Field(() => ID)
  @IsString()
  versionId!: string

  @Field(() => [ServiceDetail])
  @IsObject()
  details!: ServiceDetail[]
}
