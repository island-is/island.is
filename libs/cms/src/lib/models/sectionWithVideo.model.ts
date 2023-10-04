import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { EmbeddedVideo, mapEmbeddedVideo } from './embeddedVideo.model'
import { Html, mapHtml } from './html.model'
import { ISectionWithVideo } from '../generated/contentfulTypes'
import { SystemMetadata } from 'api-cms-domain'
import { Link, mapLink } from './link.model'

@ObjectType()
export class SectionWithVideo {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => Boolean, { nullable: true })
  showTitle?: boolean

  @CacheField(() => EmbeddedVideo, { nullable: true })
  video?: EmbeddedVideo | null

  @CacheField(() => Html, { nullable: true })
  html?: Html | null

  @Field(() => String)
  locale!: string

  @CacheField(() => Link, { nullable: true })
  link?: Link | null

  @Field(() => Boolean, { nullable: true })
  showDividerOnTop?: boolean
}

export const mapSectionWithVideo = ({
  fields,
  sys,
}: ISectionWithVideo): SystemMetadata<SectionWithVideo> => ({
  typename: 'SectionWithVideo',
  id: sys.id,
  title: fields.title ?? '',
  showTitle: fields.showTitle ?? true,
  video: fields.video ? mapEmbeddedVideo(fields.video) : null,
  html: fields.content ? mapHtml(fields.content, sys.id + ':content') : null,
  locale: sys.locale === 'is-IS' ? 'is' : sys.locale,
  link: fields.link ? mapLink(fields.link) : null,
  showDividerOnTop: fields.showDividerOnTop ?? false,
})
