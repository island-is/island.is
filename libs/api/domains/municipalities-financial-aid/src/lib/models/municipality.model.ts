import { Field, ObjectType, ID } from '@nestjs/graphql'
import { AidModel } from '.'

@ObjectType()
export class MunicipalitiesFinancialAidMunicipalityModel {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly name!: string

  @Field()
  readonly active!: boolean

  @Field({ nullable: true })
  readonly homepage?: string

  @Field()
  readonly municipalityId!: string

  @Field()
  readonly individualAid!: AidModel

  @Field()
  readonly cohabitationAid!: AidModel

  @Field({ nullable: true })
  readonly email?: string

  @Field({ nullable: true })
  readonly rulesHomepage?: string
}
