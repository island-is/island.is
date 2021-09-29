import { Field, ObjectType, ID } from '@nestjs/graphql'
import { NationalRegistryResidence } from './nationalRegistryResidence.model'

@ObjectType()
export class NationalRegistryResidenceHistory {
  @Field(() => ID)
  nationalId!: string

  @Field(() => [NationalRegistryResidence], { nullable: true })
  history?: NationalRegistryResidence[]
}
