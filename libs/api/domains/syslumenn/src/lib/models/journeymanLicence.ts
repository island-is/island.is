import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class JourneymanLicence {
  @Field({ nullable: true })
  name?: string

  @Field(() => Date, { nullable: true })
  dateOfPublication?: Date

  @Field({ nullable: true })
  profession?: string

  @Field({ nullable: true })
  nationalId?: string
}

@ObjectType()
export class JourneymanLicencesResponse {
  @CacheField(() => [JourneymanLicence])
  licences!: JourneymanLicence[]
}
