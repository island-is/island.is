import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IGrant } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { LinkUrl } from './linkUrl.model'
import { Organization, mapOrganization } from './organization.model'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { CacheField } from '@island.is/nest/graphql'
import { Asset, mapAsset } from './asset.model'

@ObjectType()
export class Grant {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  applicationId?: string

  @Field(() => [String], { nullable: true })
  applicationDeadlineText?: Array<string>

  @CacheField(() => LinkUrl, { nullable: true })
  applicationUrl?: LinkUrl

  @Field({ nullable: true })
  whatIsGranted?: string

  @Field({ nullable: true })
  specialEmphasis?: string

  @Field({ nullable: true })
  whoCanApply?: string

  @Field({ nullable: true })
  howToApply?: string

  @Field({ nullable: true })
  applicationDeadline?: string

  @Field({ nullable: true })
  dateFrom?: string

  @Field({ nullable: true })
  dateTo?: string

  @Field({ nullable: true })
  isOpen?: boolean

  @Field({ nullable: true })
  status?: string

  @CacheField(() => Organization)
  organization?: Organization

  @CacheField(() => [Asset], { nullable: true })
  files?: Array<Asset>

  @CacheField(() => GenericTag, { nullable: true })
  categoryTag?: GenericTag

  @CacheField(() => GenericTag, { nullable: true })
  typeTag?: GenericTag
}

export const mapGrant = ({ fields, sys }: IGrant): Grant => ({
  id: sys.id,
  name: fields.grantName,
  description:
    (fields.grantDescription && JSON.stringify(fields.grantDescription)) ??
    undefined,
  applicationId: fields.grantApplicationId ?? '',
  applicationDeadlineText: fields.grantApplicationDeadlineText,
  applicationUrl: fields.granApplicationUrl?.fields,
  whatIsGranted:
    (fields.grantWhatIsGranted && JSON.stringify(fields.grantWhatIsGranted)) ??
    undefined,
  specialEmphasis:
    (fields.grantSpecialEmphasis &&
      JSON.stringify(fields.grantSpecialEmphasis)) ??
    undefined,
  whoCanApply:
    (fields.grantWhoCanApply && JSON.stringify(fields.grantWhoCanApply)) ??
    undefined,
  howToApply:
    (fields.grantHowToApply && JSON.stringify(fields.grantHowToApply)) ??
    undefined,
  applicationDeadline:
    (fields.grantApplicationDeadline &&
      JSON.stringify(fields.grantApplicationDeadline)) ??
    undefined,
  dateFrom: fields.grantDateFrom ?? '',
  dateTo: fields.grantDateTo ?? '',
  isOpen: fields.grantIsOpen ?? undefined,
  status: fields.grantStatus ?? '',
  organization: fields.grantOrganization
    ? mapOrganization(fields.grantOrganization)
    : undefined,
  files: (fields.grantFiles ?? []).map((file) => mapAsset(file)) ?? [],
  categoryTag: fields.grantCategoryTag
    ? mapGenericTag(fields.grantCategoryTag)
    : undefined,
  typeTag: fields.grantTypeTag ? mapGenericTag(fields.grantTypeTag) : undefined,
})
