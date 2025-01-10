import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('NationalRegistryPersonBase')
export class PersonBase {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String, {
    nullable: true,
    deprecationReason:
      'This might return the display name instead of true full name. Use name object instead.',
  })
  fullName!: string | null

  @Field(() => String, {
    nullable: true,
    description: 'Deprecated',
  })
  fate?: string | null
}
