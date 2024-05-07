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
  readonly childNationalId!: string

  @Allow()
  @Field()
  readonly childName!: string

  @Allow()
  @Field({ nullable: true })
  readonly school?: string
}
