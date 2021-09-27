import { Field, ObjectType, ID } from '@nestjs/graphql'

import {
  Application,
  HomeCircumstances,
  Employment,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'

import { ApplicationFileModel } from '../../file'
import { StaffModel } from '../../staff'
import { ApplicationEventModel } from '../../applicationEvent'

@ObjectType()
export class ApplicationModel implements Application {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field()
  readonly phoneNumber!: string

  @Field()
  readonly email!: string

  @Field(() => String)
  readonly homeCircumstances!: HomeCircumstances

  @Field({ nullable: true })
  readonly homeCircumstancesCustom?: string

  @Field()
  readonly student!: boolean

  @Field({ nullable: true })
  readonly studentCustom?: string

  @Field(() => String)
  readonly employment!: Employment

  @Field({ nullable: true })
  readonly employmentCustom?: string

  @Field()
  readonly hasIncome!: boolean

  @Field()
  readonly usePersonalTaxCredit!: boolean

  @Field({ nullable: true })
  readonly bankNumber?: string

  @Field({ nullable: true })
  readonly ledger?: string

  @Field({ nullable: true })
  readonly accountNumber?: string

  @Field({ nullable: true })
  readonly interview?: boolean

  @Field({ nullable: true })
  readonly formComment?: string

  @Field(() => String)
  readonly state!: ApplicationState

  @Field(() => [ApplicationFileModel])
  readonly files?: ApplicationFileModel[]

  @Field({ nullable: true })
  readonly amount?: number

  @Field({ nullable: true })
  readonly rejection?: string

  @Field({ nullable: true })
  readonly staff?: StaffModel

  @Field(() => [ApplicationEventModel])
  readonly applicationEvents?: ApplicationEventModel[]
}
