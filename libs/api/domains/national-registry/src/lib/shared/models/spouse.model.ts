import { Field, ObjectType } from '@nestjs/graphql'
import { PersonBase } from './personBase.model'
import { MaritalStatus } from '../types'

@ObjectType()
export class Spouse extends PersonBase {
  @Field(() => MaritalStatus, { nullable: true })
  maritalStatus?: MaritalStatus | null

  @Field(() => String, { nullable: true })
  cohabitationWithSpouse?: string | null

  @Field(() => String, { nullable: true })
  cohabitant?: string | null
}
