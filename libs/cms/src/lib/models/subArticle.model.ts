import { SystemMetadata } from '@island.is/shared/types'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ISubArticle } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { ArticleReference, mapArticleReference } from './articleReference'
import { mapStepper, Stepper } from './stepper.model'

@ObjectType()
export class SubArticle {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field(() => ArticleReference, { nullable: true })
  parent?: ArticleReference

  @Field(() => [SliceUnion])
  body: Array<typeof SliceUnion> = []

  @Field({ nullable: true })
  showTableOfContents?: boolean

  @Field(() => Stepper, { nullable: true })
  stepper!: Stepper | null
}

export const mapSubArticle = ({
  sys,
  fields,
}: ISubArticle): SystemMetadata<SubArticle> => ({
  typename: 'SubArticle',
  id: sys.id,
  title: fields.title ?? '',
  slug: (fields.url || fields.slug) ?? '',
  parent: fields.parent?.fields && mapArticleReference(fields.parent),
  body: fields.content ? mapDocument(fields.content, sys.id + ':body') : [],
  showTableOfContents: fields.showTableOfContents ?? false,
  stepper: fields.stepper ? mapStepper(fields.stepper) : null,
})
