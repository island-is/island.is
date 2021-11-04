import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'
import { Aid } from '@island.is/financial-aid/shared/lib'
import { AidInput } from './aid.input'

@InputType()
export class UpdateMunicipalityInput {
  @Allow()
  @Field(() => AidInput, { nullable: true })
  readonly individualAid?: Aid

  @Allow()
  @Field(() => AidInput, { nullable: true })
  readonly cohabitationAid?: Aid

  @Allow()
  @Field({ nullable: true })
  readonly homepage?: string

  @Allow()
  @Field({ nullable: true })
  readonly rulesHomepage?: string

  @Allow()
  @Field({ nullable: true })
  readonly email?: string
}
