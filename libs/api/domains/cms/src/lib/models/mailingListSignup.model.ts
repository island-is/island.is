import { Field, ObjectType } from '@nestjs/graphql'

import { IMailingListSignup } from '../generated/contentfulTypes'

@ObjectType()
export class MailingListSignup {
  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field()
  inputLabel: string

  @Field()
  buttonText: string
}

export const mapMailingListSignup = ({
  fields,
}: IMailingListSignup): MailingListSignup => ({
  title: fields.title,
  description: fields.description ?? '',
  inputLabel: fields.inputLabel,
  buttonText: fields.buttonText,
})
