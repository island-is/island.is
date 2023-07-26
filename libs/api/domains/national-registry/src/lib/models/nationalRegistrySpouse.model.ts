import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { NationalRegistryMaritalStatus } from '../nationalRegistry.types'

registerEnumType(NationalRegistryMaritalStatus, {
  name: 'NationalRegistryMaritalStatus',
})

@ObjectType()
export class NationalRegistrySpouse {
  @Field(() => ID, { nullable: true })
  nationalId?: string | null

  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => NationalRegistryMaritalStatus, { nullable: true })
  maritalStatus?: NationalRegistryMaritalStatus | null

  @Field(() => String, { nullable: true })
  cohabitation?: string | null
}
