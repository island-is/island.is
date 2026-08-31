import { Field, ObjectType } from '@nestjs/graphql'

import { CustomsGeneralValidity } from './customsGeneralValidity.model'

@ObjectType()
export class CustomsGeneralStorageLocation extends CustomsGeneralValidity {
  @Field(() => String, { nullable: true })
  nationalId?: string

  @Field(() => String, { nullable: true })
  code?: string

  @Field(() => String, { nullable: true })
  companyName?: string

  @Field(() => String, { nullable: true })
  location?: string

  @Field(() => String, { nullable: true })
  system?: string
}
