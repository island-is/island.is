import { Field, ObjectType } from '@nestjs/graphql'

/**
 * Validity shared by every entry the upstream API dates. `notYetInEffect` marks the
 * entries that are published ahead of time, i.e. the ones that only take effect after
 * the reference date the query asked for.
 */
@ObjectType({ isAbstract: true })
export abstract class CustomsGeneralValidity {
  @Field(() => Date, { nullable: true })
  validFrom?: Date

  @Field(() => Date, { nullable: true })
  validTo?: Date

  @Field(() => Boolean, { nullable: true })
  notYetInEffect?: boolean
}
