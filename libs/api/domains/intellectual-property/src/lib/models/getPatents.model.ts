import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertyPatent')
export class Patent {
  @Field({ nullable: true })
  applicationNumber?: string | null

  @Field({ nullable: true })
  registrationNumber?: string | null

  @Field({ nullable: true })
  patentName?: string | null

  @Field({ nullable: true })
  patentNameInOrgLanguage?: string | null

  @Field({ nullable: true })
  applicationDate?: Date

  @Field({ nullable: true })
  statusText?: string | null
}
