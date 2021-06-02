import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class GenericLicense {
  @Field()
  name!: string

  @Field()
  type!: string

  @Field({ nullable: true })
  issuer?: string
}
