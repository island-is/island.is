import GraphQLJSON from 'graphql-type-json'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IEmailSignup } from '../generated/contentfulTypes'
import { FormField, mapFormField } from './formField.model'

@ObjectType()
export class EmailSignup {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @CacheField(() => [FormField], { nullable: true })
  formFields?: FormField[]

  @Field({ nullable: true })
  signupType?: 'mailchimp' | 'zenter'

  @Field(() => GraphQLJSON, { nullable: true })
  configuration?: Record<string, unknown>

  @Field(() => GraphQLJSON, { nullable: true })
  translations?: Record<string, string>
}

export const mapEmailSignup = ({
  fields,
  sys,
}: IEmailSignup): SystemMetadata<EmailSignup> => ({
  typename: 'EmailSignup',
  id: sys.id,
  title: fields.title ?? '',
  description: fields.description ?? '',
  formFields: (fields.formFields ?? []).map(mapFormField),
  signupType: fields.signupType || 'mailchimp',
  configuration: fields.configuration ?? {},
  translations: fields.translations ?? {},
})
