import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UniversityGatewayProgramFilter')
export class UniversityGatewayProgramFilter {
  @Field()
  field!: string

  @CacheField(() => [String])
  options!: string[]
}
