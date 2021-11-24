import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ISupportForm } from '../generated/contentfulTypes'
import { mapOrganization, Organization } from './organization.model'

@ObjectType()
export class SupportForm {
  @Field(() => ID)
  id!: string

  @Field(() => Organization, { nullable: true })
  organization!: Organization | null

  @Field()
  category!: string

  @Field({ nullable: true })
  form?: string
}

export const mapSupportForm = ({ fields, sys }: ISupportForm): SupportForm => ({
  id: sys.id,
  category: fields.category ?? '',
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  form: fields.form ? JSON.stringify(fields.form) : '',
})
