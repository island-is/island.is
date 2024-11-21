import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import { IGrant } from '../generated/contentfulTypes'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { CacheField } from '@island.is/nest/graphql'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { Asset, mapAsset } from './asset.model'
import { ReferenceLink, mapReferenceLink } from './referenceLink.model'
import { Fund, mapFund } from './fund.model'

export enum GrantStatus {
  CLOSED,
  OPEN,
  SEE_DESCRIPTION,
}

registerEnumType(GrantStatus, { name: 'GrantStatus' })

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

  @Field({ nullable: true })
  applicationDeadlineStatus?: string

  @CacheField(() => ReferenceLink, { nullable: true })
  applicationUrl?: ReferenceLink

  @CacheField(() => [SliceUnion])
  specialEmphasis?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  whoCanApply?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  howToApply?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  applicationDeadline?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  applicationHints?: Array<typeof SliceUnion>

  @Field({ nullable: true })
  dateFrom?: string

  @Field({ nullable: true })
  dateTo?: string

  @Field({ nullable: true })
  isOpen?: boolean

  @CacheField(() => GrantStatus, { nullable: true })
  status?: GrantStatus

  @CacheField(() => [Asset], { nullable: true })
  files?: Array<Asset>

  @CacheField(() => [GenericTag], { nullable: true })
  categoryTags?: Array<GenericTag>

  @CacheField(() => GenericTag, { nullable: true })
  typeTag?: GenericTag

  @CacheField(() => Fund, { nullable: true })
  fund?: Fund
}

export const mapGrant = ({ fields, sys }: IGrant): Grant => ({
  id: sys.id,
  name: fields.grantName,
  description: fields.grantDescription,
  applicationId: fields.grantApplicationId,
  applicationDeadlineStatus: fields.grantApplicationDeadlineStatus,
  applicationUrl: fields.granApplicationUrl?.fields
    ? mapReferenceLink(fields.granApplicationUrl)
    : undefined,

  specialEmphasis: fields.grantSpecialEmphasis
    ? mapDocument(fields.grantSpecialEmphasis, sys.id + ':special-emphasis')
    : [],
  whoCanApply: fields.grantWhoCanApply
    ? mapDocument(fields.grantWhoCanApply, sys.id + ':who-can-apply')
    : [],
  howToApply: fields.grantHowToApply
    ? mapDocument(fields.grantHowToApply, sys.id + ':how-to-apply')
    : [],
  applicationDeadline: fields.grantApplicationDeadline
    ? mapDocument(
        fields.grantApplicationDeadline,
        sys.id + ':application-deadline',
      )
    : [],
  applicationHints: fields.grantApplicationHints
    ? mapDocument(fields.grantApplicationHints, sys.id + ':application-hints')
    : [],
  dateFrom: fields.grantDateFrom,
  dateTo: fields.grantDateTo,
  isOpen: fields.grantIsOpen ?? undefined,
  status:
    fields.grantStatus === 'open'
      ? GrantStatus.OPEN
      : fields.grantStatus === 'closed'
      ? GrantStatus.CLOSED
      : fields.grantStatus === 'see_description'
      ? GrantStatus.SEE_DESCRIPTION
      : undefined,
  fund: fields.grantFund ? mapFund(fields.grantFund) : undefined,
  files: (fields.grantFiles ?? []).map((file) => mapAsset(file)) ?? [],
  categoryTags: fields.grantCategoryTags
    ? fields.grantCategoryTags.map((tag) => mapGenericTag(tag))
    : undefined,
  typeTag: fields.grantTypeTag ? mapGenericTag(fields.grantTypeTag) : undefined,
})
