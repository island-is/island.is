import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityAvailableServiceProvider')
export class AvailableServiceProvider {
  @Field(() => ID, { description: 'Id of the service provider' })
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String, {
    description: 'Company kennitala, 10 digits, no hyphen',
  })
  nationalId!: string
}
