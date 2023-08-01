import { Field, ObjectType } from '@nestjs/graphql'
import { NationalRegistryBasePerson } from './nationalRegistryBasePerson.model'

@ObjectType('NationalRegistryCustodian')
export class NationalRegistryCustodian extends NationalRegistryBasePerson {
  @Field(() => String, { nullable: true })
  code?: string | null

  @Field(() => String, { nullable: true })
  text?: string | null

  @Field(() => Boolean, { nullable: true })
  livesWithChild?: boolean | null
}
