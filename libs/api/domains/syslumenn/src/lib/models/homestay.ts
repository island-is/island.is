import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class Homestay {
  @Field()
  registrationNumber: string

  @Field()
  name: string

  @Field()
  address: string

  @Field()
  manager: string

  @Field()
  year: number

  @Field()
  city: string
}
