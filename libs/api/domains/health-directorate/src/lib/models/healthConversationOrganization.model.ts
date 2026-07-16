import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class HealthDirectorateConversationOrganization {
  @Field()
  nationalId!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  departmentName?: string

  @Field({ nullable: true })
  logoUrl?: string
}
