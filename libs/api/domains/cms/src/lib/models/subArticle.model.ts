import { Field, ObjectType } from '@nestjs/graphql'
import { ISubArticle } from '../generated/contentfulTypes'
import { SliceUnion } from '../unions/slice.union'
import { mapDocument } from './slice.model'

@ObjectType()
export class SubArticle {
  @Field()
  title: string

  @Field()
  slug: string

  @Field(() => [SliceUnion])
  body: Array<typeof SliceUnion>
}

export const mapSubArticle = ({ sys, fields }: ISubArticle): SubArticle => ({
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  body: fields.content ? mapDocument(fields.content, sys.id + ':body') : [],
})
