import { Field, ObjectType } from '@nestjs/graphql'

import { CustomsGeneralValidity } from './customsGeneralValidity.model'

@ObjectType()
export class CustomsGeneralExchangeRate extends CustomsGeneralValidity {
  @Field(() => String, { nullable: true })
  code?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  rate?: string
}
