import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'
import type { Aid, ChildrenAid } from '@island.is/financial-aid/shared/lib'
import { AidInput } from '../../aid'

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

  @Allow()
  @Field({ nullable: true })
  readonly usingNav?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly navUrl?: string

  @Allow()
  @Field({ nullable: true })
  readonly navUsername?: string

  @Allow()
  @Field({ nullable: true })
  readonly navPassword?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly childrenAid?: ChildrenAid

  @Allow()
  @Field({ nullable: true })
  readonly decemberCompensation?: number

  @Allow()
  @Field()
  readonly municipalityId!: string
}
