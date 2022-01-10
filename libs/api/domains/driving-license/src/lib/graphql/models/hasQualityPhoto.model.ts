import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class HasQualityPhoto {
  @Field(() => ID)
  nationalId!: string

  @Field()
  hasQualityPhoto!: boolean
}
