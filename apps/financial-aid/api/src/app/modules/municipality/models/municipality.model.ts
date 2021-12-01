import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Municipality } from '@island.is/financial-aid/shared/lib'

import { AidModel } from '../../aid'
import { StaffModel } from '../../staff/models'

@ObjectType()
export class MunicipalityModel implements Municipality {
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

  @Field({ nullable: true })
  readonly numberOfUsers?: number

  @Field(() => [StaffModel], { nullable: true })
  readonly adminUsers?: StaffModel[]
}
