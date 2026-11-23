import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('DirectorateOfEqualityServiceProvider')
export class ServiceProvider {
  @Field(() => ID, { description: 'Id of the permission (delegation)' })
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String, {
    description: 'Company kennitala, 10 digits, no hyphen',
  })
  nationalId!: string

  @Field(() => Date)
  grantedAt!: Date

  @Field(() => String, {
    nullable: true,
    description: 'Name of the person who granted the permission',
  })
  grantedByName?: string
}
