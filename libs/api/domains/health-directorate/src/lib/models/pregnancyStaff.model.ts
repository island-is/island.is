import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePregnancyStaff')
export class PregnancyStaff {
  @Field()
  name!: string

  @Field(() => Int, {
    nullable: true,
    description:
      'Numeric employee-type code from the source system. No label catalogue exists yet — render raw, or resolve via `profession` instead.',
  })
  employeeType?: number

  @Field({ nullable: true })
  profession?: string

  @Field({ nullable: true })
  organizationName?: string

  @Field({ nullable: true })
  divisionName?: string
}
