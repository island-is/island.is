import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesMarketingAuthorization')
export class MarketingAuthorization {
  @Field({ nullable: true })
  icelandicAuthorizationNumber?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  icelandicAuthorizationDate?: Date

  @Field({ nullable: true })
  foreignAuthorizationNumber?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  foreignAuthorizationDate?: Date
}
