import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Municipality } from '@island.is/financial-aid/shared/lib'

import { AidModel } from '../../aid'

@ObjectType()
export class MunicipalityModel implements Municipality {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly name!: string

  @Field()
  readonly active!: boolean

  @Field()
  readonly homepage?: string

  @Field()
  readonly municipalityId!: string

  @Field()
  readonly individualAid!: AidModel

  @Field()
  readonly cohabitationAid!: AidModel
}
