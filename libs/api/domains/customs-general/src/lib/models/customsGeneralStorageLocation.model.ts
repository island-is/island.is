import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralStorageLocation {
  @Field(() => String, { nullable: true })
  kennitala?: string

  @Field(() => String, { nullable: true })
  code?: string

  @Field(() => String, { nullable: true })
  companyName?: string

  @Field(() => String, { nullable: true })
  location?: string

  @Field(() => Date, { nullable: true })
  validFrom?: Date

  @Field(() => Date, { nullable: true })
  validTo?: Date

  @Field(() => String, { nullable: true })
  system?: string
}
