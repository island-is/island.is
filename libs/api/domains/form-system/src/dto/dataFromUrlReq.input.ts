import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemDataFromUrlInput')
export class DataFromUrlInput {
  @Field(() => String, { nullable: true })
  fieldId?: string

  @Field(() => String, { nullable: true })
  orgNationalId?: string

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => Boolean, { nullable: false })
  isTest!: boolean

  @Field(() => String, { nullable: true })
  zendeskInstance?: string
}
