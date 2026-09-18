import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateCommunicationStaffRef')
export class CommunicationStaffRef {
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
