import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Homestay {
  @Field({ nullable: true })
  registrationNumber?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  manager?: string

  @Field({ nullable: true })
  year?: number

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  guests?: number

  @Field({ nullable: true })
  rooms?: number

  @Field({ nullable: true })
  propertyId?: string

  @Field({ nullable: true })
  apartmentId?: string
}
