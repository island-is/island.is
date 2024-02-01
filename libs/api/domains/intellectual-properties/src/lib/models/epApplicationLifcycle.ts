import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesEPApplicationLifecycle')
export class EPApplicationLifecycle {
  @Field(() => GraphQLISODateTime, { nullable: true })
  publishDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  applicationDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  provisionDatePublishedInGazette?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  translationSubmissionDate?: Date
}
