import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import {
  ILink,
  ILinkFields,
  ILinkGroup,
  ILinkGroupFields,
  IOrganizationSubpage,
  IProjectPage,
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

type EntryAbove = IProjectPage

type LinkType = Omit<
  ILink | IOrganizationSubpage | IProjectSubpage,
  'update' | 'toPlainObject'
>

export type ILinkGroupModel = {
  fields: ILinkGroupFields & {
    /** Primary Link */
    primaryLink: LinkType

    /** Children Links */
    childrenLinks?: LinkType[] | undefined
  }
  sys: ILinkGroup['sys']
  entryAbove?: EntryAbove
}

export const mapLinkGroup = ({
  fields,
  sys,
  entryAbove,
}: ILinkGroupModel): LinkGroup => {
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
  } else if (contentTypeId === 'projectSubpage') {
    const subpage = fields.primaryLink as IProjectSubpage
    const prefix = getProjectPrefix(sys.locale)

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
        url: `/${prefix}/${entryAbove?.fields.slug}/${subpage.fields.slug}`,
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
      return doMapLink(link, sys.locale, entryAbove)
    }),
  }
}

const doMapLink = (
  link: ILink | IOrganizationSubpage | IProjectSubpage,
  locale: string,
  entryAbove: EntryAbove | undefined,
) => {
  if (link.sys?.contentType?.sys?.id === 'organizationSubpage') {
    const organizationSubpage = link as IOrganizationSubpage
    return mapLink(
      convertOrganizationSubpageToLink(organizationSubpage, locale),
    )
  } else if (link.sys.contentType.sys.id === 'projectSubpage') {
    const projectSubpage = link as IProjectSubpage
    return mapLink(
      convertProjectSubpageToLink(projectSubpage, locale, entryAbove),
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

const getProjectPrefix = (locale: string) => {
  if (locale && !locale.includes('is')) {
    return `${locale}/p`
  }
  return 'v'
}

const convertProjectSubpageToLink = (
  projectSubpage: IProjectSubpage,
  locale: string,
  entryAbove: EntryAbove | undefined,
) => {
  const prefix = getProjectPrefix(locale)
  return {
    sys: {
      ...projectSubpage.sys,
      contentType: {
        sys: {
          ...projectSubpage.sys.contentType.sys,
          id: 'link',
        },
      },
    },
    fields: {
      text: projectSubpage.fields.title,
      url: `/${prefix}/${entryAbove?.fields.slug}/${projectSubpage.fields.slug}`,
    },
  } as ILink
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
