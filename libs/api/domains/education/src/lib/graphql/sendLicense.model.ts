import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SendLicense {
  @Field()
  email!: string
}
