import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectoratePregnancyCommunicationAuthor')
export class PregnancyCommunicationAuthor {
  @Field()
  name!: string

  @Field({ nullable: true })
  role?: string

  @Field({ nullable: true })
  profession?: string

  @Field({ nullable: true })
  divisionName?: string

  @Field({ nullable: true })
  organizationName?: string
}
