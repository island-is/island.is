import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { NationalRegistryMaritalStatus } from '../nationalRegistry.types'
import { NationalRegistryBasePerson } from './nationalRegistryBasePerson.model'

registerEnumType(NationalRegistryMaritalStatus, {
  name: 'NationalRegistryMaritalStatus',
})

@ObjectType()
export class NationalRegistrySpouse extends NationalRegistryBasePerson {
  @Field(() => NationalRegistryMaritalStatus, { nullable: true })
  maritalStatus?: NationalRegistryMaritalStatus | null

  @Field(() => String, { nullable: true })
  cohabitation?: string | null
}
