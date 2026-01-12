import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { IServiceWebPage } from '../generated/contentfulTypes'
import { mapOrganization, Organization } from './organization.model'
import {
  mapDocument,
  safelyMapSliceUnion,
  SliceUnion,
} from '../unions/slice.union'
import { FooterItem, mapFooterItem } from './footerItem.model'
import { AlertBanner, mapAlertBanner } from './alertBanner.model'

@ObjectType()
class ServiceWebPageEmailConfigItem {
  @Field(() => String)
  supportCategoryId!: string

  @CacheField(() => [String])
  emailList!: string[]
}

@ObjectType()
class ServiceWebPageEmailConfig {
  @CacheField(() => [ServiceWebPageEmailConfigItem])
  emails!: ServiceWebPageEmailConfigItem[]
}

@ObjectType()
export class ServiceWebPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => Organization, { nullable: true })
  organization?: Organization | null

  @CacheField(() => [SliceUnion])
  slices?: Array<typeof SliceUnion | null>

  @CacheField(() => [FooterItem], { nullable: true })
  footerItems?: Array<FooterItem>

  @CacheField(() => ServiceWebPageEmailConfig, { nullable: true })
  emailConfig?: ServiceWebPageEmailConfig

  @CacheField(() => [SliceUnion], { nullable: true })
  contactFormDisclaimer?: Array<typeof SliceUnion | null>

  @CacheField(() => AlertBanner, { nullable: true })
  alertBanner?: AlertBanner | null
}

const mapServiceWebPageEmailConfig = (
  emailConfig: IServiceWebPage['fields']['emailConfig'],
): ServiceWebPageEmailConfig => {
  const emails = [] as ServiceWebPageEmailConfig['emails']

  for (const { supportCategoryId, emailList } of emailConfig?.emails ?? []) {
    if (supportCategoryId && Array.isArray(emailList)) {
      emails.push({
        emailList,
        supportCategoryId,
      })
    }
  }

  return {
    emails,
  }
}

export const mapServiceWebPage = ({
  sys,
  fields,
}: IServiceWebPage): ServiceWebPage => ({
  id: sys.id,
  title: fields.title ?? '',
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  slices: (fields.slices ?? []).map(safelyMapSliceUnion).filter(Boolean),
  footerItems: (fields.footerItems ?? []).map(mapFooterItem),
  emailConfig: fields.emailConfig
    ? mapServiceWebPageEmailConfig(fields.emailConfig)
    : { emails: [] },
  contactFormDisclaimer: fields.contactFormDisclaimer
    ? mapDocument(
        fields.contactFormDisclaimer,
        sys.id + ':contactFormDisclaimer',
      )
    : [],
  alertBanner: fields.alertBanner ? mapAlertBanner(fields.alertBanner) : null,
})
