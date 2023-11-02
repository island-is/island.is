import { Field, ObjectType } from '@nestjs/graphql'
import { PersonBase } from './personBase.model'

@ObjectType('NationalRegistryCustodian')
export class Custodian extends PersonBase {
  @Field(() => String, { nullable: true })
  code?: string | null

  @Field(() => String, { nullable: true })
  text?: string | null

  @Field(() => Boolean, { nullable: true })
  livesWithChild?: boolean | null
}
