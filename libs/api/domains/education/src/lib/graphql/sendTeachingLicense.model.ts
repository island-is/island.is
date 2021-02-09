import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SendTeachingLicense {
  @Field()
  email!: string
}
