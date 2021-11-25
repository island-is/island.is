import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'
import { CreateStaffInput } from '../../staff'

@InputType()
export class CreateMunicipalityInput {
  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field()
  readonly municipalityId!: string

  @Allow()
  @Field()
  readonly admin!: CreateStaffInput
}
