import { Field, ID, ObjectType } from '@nestjs/graphql'

/**
 * A child as the Frigg "Mínar síður" API knows it (GET /me/children).
 *
 * Frigg keys children on its own `id`, which is not the data-gateway
 * `studentId` the primary-school screens route on, so the two are matched by
 * national id. MMS documents `id` as "the id the data gateway returns", but
 * that does not hold in practice, which is why the match exists.
 */
@ObjectType('EducationPrimarySchoolChild')
export class PrimarySchoolChild {
  @Field(() => ID)
  id!: string

  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  preferredName?: string

  @Field({ nullable: true })
  gradeLevel?: string
}
