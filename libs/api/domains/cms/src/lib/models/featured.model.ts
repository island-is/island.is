import { Field, ObjectType } from '@nestjs/graphql'
import { IFeatured } from '../generated/contentfulTypes'
import { mapReferenceLink, ReferenceLink } from './referenceLink.model'

@ObjectType()
export class Featured {
  @Field()
  title?: string

  @Field(() => Boolean)
  attention?: boolean

  @Field(() => ReferenceLink, { nullable: true })
  thing?: ReferenceLink | null
}

export const mapFeatured = ({ fields }: IFeatured): Featured => ({
  title: fields.title ?? '',
  attention: fields.attention ?? false,
  thing: (fields.thing && mapReferenceLink(fields.thing)) ?? null,
})
