import { Field, ObjectType } from '@nestjs/graphql'

/**
 * Fallback data for license verification
 * Old verification methods will return JSON data as a string
 */
@ObjectType('LicenseFallbackData')
export class LicenseFallbackData {
  @Field(() => String, { nullable: true })
  value?: string
}
