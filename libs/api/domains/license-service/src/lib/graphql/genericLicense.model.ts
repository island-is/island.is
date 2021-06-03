import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Payload {
  @Field(() => [String])
  data!: string[]

  @Field()
  rawData?: string
}

@ObjectType()
export class GenericUserLicenseFields {
  @Field()
  licenseType!: string

  @Field()
  nationalId!: string

  @Field({ nullable: true })
  expidationDate!: Date

  @Field(() => Payload)
  payload!: Payload
}
