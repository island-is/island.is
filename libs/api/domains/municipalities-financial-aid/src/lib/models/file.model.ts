import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ApplicationFileModelTypeEnum } from '@island.is/clients/municipalities-financial-aid'

@ObjectType('MunicipalitiesFinancialAidApplicationFileModel')
export class ApplicationFileModel {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: Date

  @Field()
  readonly applicationId!: string

  @Field()
  readonly name!: string

  @Field()
  readonly key!: string

  @Field()
  readonly size!: number

  @Field(() => String)
  readonly type!: ApplicationFileModelTypeEnum
}
