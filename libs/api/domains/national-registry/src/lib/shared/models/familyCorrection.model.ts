import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('NationalRegistryFamilyCorrectionResponse')
export class FamilyCorrectionResponse {
  @Field()
  success!: boolean

  @Field()
  message?: string
}
