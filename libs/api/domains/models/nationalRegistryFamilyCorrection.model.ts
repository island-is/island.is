import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NationalRegistryFamilyCorrectionResponse {
  @Field()
  success!: boolean

  @Field()
  message?: string
}
