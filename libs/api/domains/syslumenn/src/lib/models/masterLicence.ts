import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class MasterLicence {
  @Field({ nullable: true })
  name?: string

  @Field(() => Date, { nullable: true })
  dateOfPublication?: Date

  @Field({ nullable: true })
  office?: string

  @Field({ nullable: true })
  profession?: string

  @Field({ nullable: true })
  nationalId?: string
}

@ObjectType()
export class MasterLicencesResponse {
  @CacheField(() => [MasterLicence])
  licences!: MasterLicence[]
}
