import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Document {
  @Field((type) => ID)
  id: string

  @Field((type) => Date)
  date: Date

  @Field((type) => String)
  subject: string

  @Field((type) => String)
  senderName: string

  @Field((type) => String)
  senderNatReg: string

  @Field((type) => Boolean)
  opened: boolean
}
