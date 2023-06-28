import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertyPatentCollectionEntry')
export class PatentCollectionEntry {
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

@ObjectType('IntellectualPropertyPatentCollection')
export class PatentCollection {
  @Field(() => [PatentCollectionEntry], { nullable: true })
  patentEntries?: Array<PatentCollectionEntry> | null
}
