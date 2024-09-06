import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { CreateChildren } from '@island.is/financial-aid/shared/lib'

@InputType()
export class CreateChildrenInput implements CreateChildren {
  @Allow()
  @Field()
  readonly applicationId!: string

  @Allow()
  @Field()
  readonly nationalId!: string

  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field({ nullable: true })
  readonly school?: string

  @Allow()
  @Field()
  readonly livesWithApplicant!: boolean

  @Allow()
  @Field()
  readonly livesWithBothParents!: boolean
}
