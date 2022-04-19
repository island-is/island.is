import { Field, ObjectType, ID } from '@nestjs/graphql'

import { ApplicationEventModelEventTypeEnum } from '@island.is/clients/municipalities-financial-aid'

@ObjectType('MunicipalitiesFinancialAidApplicationEventModel')
export class ApplicationEventModel {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: Date

  @Field()
  readonly applicationId!: string

  @Field({ nullable: true })
  readonly comment?: string

  @Field(() => String)
  readonly eventType!: ApplicationEventModelEventTypeEnum

  @Field({ nullable: true })
  readonly staffNationalId?: string

  @Field({ nullable: true })
  readonly staffName?: string
}
