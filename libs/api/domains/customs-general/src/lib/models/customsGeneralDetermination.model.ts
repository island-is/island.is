import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralDetermination {
  @Field(() => String)
  countryCode!: string

  @Field(() => String)
  location!: string

  @Field(() => String)
  locationName!: string
}
