import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralStorageLocation {
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
