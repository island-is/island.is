import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UniversityGatewayApplication')
export class UniversityGatewayApplication {
  @Field()
  id!: string

  @Field()
  nationalId!: string
}
