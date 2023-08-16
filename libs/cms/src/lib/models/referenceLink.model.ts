import { Field, ObjectType } from '@nestjs/graphql'
import { ILinkUrl } from '../generated/contentfulTypes'
import { PageTypes } from '../unions/page.union'
import { getRelativeUrl } from './utils'

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

export const mapReferenceLink = ({
  sys,
  fields,
}: PageTypes | ILinkUrl): ReferenceLink => {
  let slugValue = ''

  const slugField = (fields as PageTypes['fields']).slug
  const urlField = (fields as ILinkUrl['fields']).url

  if (slugField) {
    slugValue = slugField
  } else if (urlField) {
    slugValue = getRelativeUrl(urlField)
  }

  return {
    slug: slugValue,
    type: typeMap[sys.contentType.sys.id] ?? sys.contentType.sys.id,
  }
}
