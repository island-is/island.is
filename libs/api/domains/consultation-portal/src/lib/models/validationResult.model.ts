import { Field, ObjectType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

@ObjectType('ConsultationPortalValidationResult')
export class ValidationResult {
  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => GraphQLJSONObject, { nullable: true })
  errors?: { [key: string]: string[] } | null
}
