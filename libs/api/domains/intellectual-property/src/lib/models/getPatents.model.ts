import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertyPatent')
export class Patent {
  @Field(() => String, { nullable: true })
  applicationNumber?: string | null

  @Field(() => String, { nullable: true })
  registrationNumber?: string | null

  @Field(() => String, { nullable: true })
  patentName?: string | null

  @Field(() => String, { nullable: true })
  patentNameInOrgLanguage?: string | null

  @Field(() => Date, { nullable: true })
  applicationDate?: Date

  @Field(() => String, { nullable: true })
  statusText?: string | null
}
