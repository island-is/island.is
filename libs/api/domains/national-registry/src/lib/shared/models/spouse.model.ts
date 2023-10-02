import { Field, ObjectType } from '@nestjs/graphql'
import { PersonBase } from './personBase.model'
import { MaritalStatus } from '../types'

@ObjectType('NationalRegistrySpouse')
export class Spouse extends PersonBase {
  @Field(() => String, { nullable: true })
  maritalStatus?: MaritalStatus | null | string

  @Field(() => Boolean, { nullable: true })
  cohabitationWithSpouse?: boolean | null

  @Field(() => String, { nullable: true })
  cohabitant?: string | null

  @Field(() => String, {
    nullable: true,
    deprecationReason: 'Renaming to fullName',
  })
  name?: string | null
}
