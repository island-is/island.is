import { Field, ObjectType } from '@nestjs/graphql'
import { ILinkUrl, IOrganizationSubpage } from '../generated/contentfulTypes'
import { PageTypes } from '../unions/page.union'

@ObjectType()
export class ReferenceLink {
  @Field()
  slug!: string

  @Field()
  type!: string
}

// this is here cause page content types names don't match in API and Contentful
const typeMap: { [key: string]: string } = {
  vidspyrnaPage: 'adgerdirpage',
  'vidspyrna-frontpage': 'adgerdirfrontpage',
}

const mapPageSlug = (page: PageTypes | ILinkUrl): string => {
  switch (page.sys.contentType.sys.id) {
    case 'organizationSubpage':
      return (
        (page.fields as IOrganizationSubpage['fields']).organizationPage.fields
          .slug +
        '/' +
        (page.fields as IOrganizationSubpage['fields']).slug
      )

    case 'linkUrl':
      return (page.fields as ILinkUrl['fields']).url

    default:
      return (page.fields as PageTypes['fields']).slug ?? ''
  }
}

export const mapReferenceLink = (
  page: PageTypes | ILinkUrl,
): ReferenceLink => ({
  slug: mapPageSlug(page),
  type: typeMap[page.sys.contentType.sys.id] ?? page.sys.contentType.sys.id,
})
