import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IUrl } from '../generated/contentfulTypes'
import { mapReferenceLink, ReferenceLink } from './referenceLink.model'

@ObjectType()
export class Url {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  title?: string

  @CacheField(() => ReferenceLink, { nullable: true })
  page!: ReferenceLink | null

  @Field(() => [String])
  urlsList!: Array<string>

  @Field(() => String, { nullable: true })
  explicitRedirect?: string
}

export const mapUrl = ({ fields, sys }: IUrl): Url => ({
  id: sys.id,
  title: fields.title ?? '',
  page: fields.page ? mapReferenceLink(fields.page) : null,
  explicitRedirect: fields.explicitRedirect ?? '',
  urlsList: fields.urlsList ?? [],
})
