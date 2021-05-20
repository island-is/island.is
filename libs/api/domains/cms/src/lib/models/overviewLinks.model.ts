import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IOverviewLinks } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { IntroLinkImage, mapIntroLinkImage } from './introLinkImage.model'
import { SystemMetadata } from 'api-cms-domain'

@ObjectType()
export class OverviewLinks {
  @Field(() => ID)
  id!: string

  @Field(() => [IntroLinkImage])
  overviewLinks!: Array<IntroLinkImage>

  @Field(() => Link, { nullable: true })
  link!: Link | null
}

export const mapOverviewLinks = ({
  sys,
  fields,
}: IOverviewLinks): SystemMetadata<OverviewLinks> => ({
  typename: 'OverviewLinks',
  id: sys.id,
  overviewLinks: (fields.overviewLinks ?? []).map(mapIntroLinkImage),
  link: fields.link ? mapLink(fields.link) : null,
})
