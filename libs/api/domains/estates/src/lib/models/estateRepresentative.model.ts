import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class EstatesRepresentative {
  @Field()
  name!: string

  @Field()
  nationalId!: string

  @Field({ nullable: true })
  text?: string
}
