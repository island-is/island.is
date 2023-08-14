import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PlateAvailability {
  @Field(() => Boolean)
  available!: boolean

  @Field(() => String)
  regno!: string
}
