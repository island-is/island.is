import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IOrganizationParentSubpage } from '../generated/contentfulTypes'
import { getOrganizationPageUrlPrefix } from '@island.is/shared/utils'
import { Image, mapImage } from './image.model'

@ObjectType()
class OrganizationSubpageLink {
  @Field()
  label!: string

  @Field()
  href!: string
}

@ObjectType()
export class OrganizationParentSubpage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => [OrganizationSubpageLink])
  childLinks!: OrganizationSubpageLink[]

  @CacheField(() => Image, { nullable: true })
  image?: Image | null
}

export const mapOrganizationParentSubpage = ({
  sys,
  fields,
}: IOrganizationParentSubpage): OrganizationParentSubpage => {
  return {
    id: sys.id,
    title: fields.title,
    childLinks:
      fields.pages?.map((page) => ({
        label: page.fields.title,
        href: `/${getOrganizationPageUrlPrefix(sys.locale)}/${
          page.fields.organizationPage.fields.slug
        }/${fields.slug}/${page.fields.slug}`,
      })) ?? [],
    image: fields.image ? mapImage(fields.image) : null,
  }
}
