import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import {
  ILink,
  ILinkGroup,
  IOrganizationSubpage,
  IProjectSubpage,
} from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
@ObjectType()
export class LinkGroup {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @CacheField(() => Link, { nullable: true })
  primaryLink!: Link | null

  @CacheField(() => [Link])
  childrenLinks?: Array<Link>
}

export const mapLinkGroup = ({ fields, sys }: ILinkGroup): LinkGroup => {
  let primaryLink: Link | null = null
  const contentTypeId = fields.primaryLink.sys.contentType.sys.id

  if (contentTypeId === 'organizationSubpage') {
    const subpage = fields.primaryLink as IOrganizationSubpage
    const prefix = getOrganizationPrefix(sys.locale)

    primaryLink = mapLink({
      ...subpage,
      sys: {
        ...subpage.sys,
        contentType: {
          sys: {
            ...subpage.sys.contentType.sys,
            id: 'link',
          },
        },
      },
      fields: {
        text: subpage.fields.title,
        url: `/${prefix}/${subpage.fields.organizationPage.fields.slug}/${subpage.fields.slug}`,
      },
    })
  } else if (contentTypeId === 'link') {
    primaryLink = mapLink(fields.primaryLink as ILink)
  }

  return {
    id: sys.id,
    name: fields.name ?? '',
    primaryLink,
    childrenLinks: (fields.childrenLinks ?? []).map((link) => {
      return doMapLink(link, sys.locale)
    }),
  }
}

const doMapLink = (
  link: ILink | IOrganizationSubpage | IProjectSubpage,
  locale: string,
) => {
  if (link.sys?.contentType?.sys?.id === 'organizationSubpage') {
    const organizationSubpage = link as IOrganizationSubpage
    return mapLink(
      convertOrganizationSubpageToLink(organizationSubpage, locale),
    )
  } else {
    return mapLink(link as ILink)
  }
}

const getOrganizationPrefix = (locale: string) => {
  if (locale && !locale.includes('is')) {
    return `${locale}/o`
  }
  return 's'
}

const convertOrganizationSubpageToLink = (
  organizationSubpage: IOrganizationSubpage,
  locale: string,
) => {
  const prefix = getOrganizationPrefix(locale)
  return {
    sys: {
      ...organizationSubpage.sys,
      contentType: {
        sys: {
          ...organizationSubpage.sys.contentType.sys,
          id: 'link',
        },
      },
    },
    fields: {
      text: organizationSubpage.fields.title,
      url: `/${prefix}/${organizationSubpage.fields.organizationPage.fields.slug}/${organizationSubpage.fields.slug}`,
    },
  } as ILink
}
