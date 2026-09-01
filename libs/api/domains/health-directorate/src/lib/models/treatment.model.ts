import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateTreatment {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  organizationName?: string

  @Field({ nullable: true })
  departmentName?: string
}
