import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Fund } from './fund.model'
//import { Permissions } from '../../auth'

@ObjectType()
export class User {
  @Field((_1) => ID)
  nationalId: string

  @Field()
  name: string

  @Field({ nullable: true })
  mobile?: string

  //@Field(() => String, { defaultValue: 'user' })
  //role?: Permissions['role']

  @Field(() => Fund, { nullable: true })
  fund?: Fund

  @Field(() => Boolean, { defaultValue: false })
  meetsADSRequirements?: boolean
}
