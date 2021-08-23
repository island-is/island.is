import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IContactUs } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class ContactUs {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  required!: string

  @Field()
  invalidPhone!: string

  @Field()
  invalidEmail!: string

  @Field()
  labelName!: string

  @Field()
  labelPhone!: string

  @Field()
  labelEmail!: string

  @Field()
  labelSubject!: string

  @Field()
  labelMessage!: string

  @Field()
  submitButtonText!: string

  @Field()
  successMessage!: string

  @Field()
  errorMessage!: string
}

export const mapContactUs = ({
  fields,
  sys,
}: IContactUs): SystemMetadata<ContactUs> => ({
  typename: 'ContactUs',
  id: sys.id,
  title: fields.title ?? '',
  required: fields.required ?? '',
  invalidPhone: fields.invalidPhone ?? '',
  invalidEmail: fields.invalidEmail ?? '',
  labelName: fields.labelName ?? '',
  labelPhone: fields.labelPhone ?? '',
  labelEmail: fields.labelEmail ?? '',
  labelSubject: fields.labelSubject ?? '',
  labelMessage: fields.labelMessage ?? '',
  submitButtonText: fields.submitButtonText ?? '',
  successMessage: fields.successMessage ?? '',
  errorMessage: fields.errorMessage ?? '',
})
