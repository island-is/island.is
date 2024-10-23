import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import { IGrant } from '../generated/contentfulTypes'
import { Organization, mapOrganization } from './organization.model'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { CacheField } from '@island.is/nest/graphql'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { Asset, mapAsset } from './asset.model'
import { ReferenceLink, mapReferenceLink } from './referenceLink.model'

enum GrantStatus {
  CLOSED,
  OPEN,
  OPENS_SOON,
  INACTIVE,
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

  @Field(() => [String], { nullable: true })
  applicationDeadlineText?: Array<string>

  @CacheField(() => ReferenceLink, { nullable: true })
  applicationUrl?: ReferenceLink

  @CacheField(() => [SliceUnion])
  whatIsGranted?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  specialEmphasis?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  whoCanApply?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  howToApply?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  applicationDeadline?: Array<typeof SliceUnion>

  @Field({ nullable: true })
  dateFrom?: string

  @Field({ nullable: true })
  dateTo?: string

  @Field({ nullable: true })
  isOpen?: boolean

  @Field({ nullable: true })
  statusText?: string

  @CacheField(() => GrantStatus, { nullable: true })
  status?: GrantStatus

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
  description: fields.grantDescription,
  applicationId: fields.grantApplicationId ?? '',
  applicationDeadlineText: fields.grantApplicationDeadlineText,
  applicationUrl: fields.granApplicationUrl?.fields
    ? mapReferenceLink(fields.granApplicationUrl)
    : undefined,
  whatIsGranted: fields.grantWhatIsGranted
    ? mapDocument(fields.grantWhatIsGranted, sys.id + ':what-is-granted')
    : [],
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
  dateFrom: fields.grantDateFrom ?? '',
  dateTo: fields.grantDateTo ?? '',
  isOpen: fields.grantIsOpen ?? undefined,
  statusText: fields.grantStatus ?? 'Óvirkur sjóður',
  status:
    fields.grantStatus === 'Opið fyrir umsóknir'
      ? GrantStatus.OPEN
      : fields.grantStatus === 'Lokað fyrir umsóknir'
      ? GrantStatus.CLOSED
      : fields.grantStatus === 'Opnar fljótlega'
      ? GrantStatus.OPENS_SOON
      : GrantStatus.INACTIVE,
  organization: fields.grantOrganization
    ? mapOrganization(fields.grantOrganization)
    : undefined,
  files: (fields.grantFiles ?? []).map((file) => mapAsset(file)) ?? [],
  categoryTag: fields.grantCategoryTag
    ? mapGenericTag(fields.grantCategoryTag)
    : undefined,
  typeTag: fields.grantTypeTag ? mapGenericTag(fields.grantTypeTag) : undefined,
})
