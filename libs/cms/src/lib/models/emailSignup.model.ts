import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SystemMetadata } from 'api-cms-domain'
import GraphQLJSON from 'graphql-type-json'
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

  @Field(() => [FormField], { nullable: true })
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
