import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePregnancyStaff')
export class PregnancyStaff {
  @Field()
  name!: string

  @Field({ nullable: true })
  profession?: string

  @Field({ nullable: true })
  organizationName?: string

  @Field({ nullable: true })
  divisionName?: string
}
