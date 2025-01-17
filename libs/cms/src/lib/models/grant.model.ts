import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import { IGrant, IGrantFields } from '../generated/contentfulTypes'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { CacheField } from '@island.is/nest/graphql'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { Asset, mapAsset } from './asset.model'
import { ReferenceLink, mapReferenceLink } from './referenceLink.model'
import { Fund, mapFund } from './fund.model'
import { Link, mapLink } from './link.model'

import format from 'date-fns/format'
import addHours from 'date-fns/addHours'
import { isValidDate } from '@island.is/shared/utils'
import { GrantsAvailabilityStatus } from '../dto/getGrants.input'

export enum GrantStatus {
  CLOSED,
  CLOSED_OPENING_SOON,
  CLOSED_OPENING_SOON_WITH_ESTIMATION,
  CLOSED_WITH_NOTE,
  OPEN,
  OPEN_WITH_NOTE,
  ALWAYS_OPEN,
  INVALID,
  UNKNOWN,
}

export enum GrantAvailability {
  CLOSED,
  OPEN,
  UNKNOWN,
}

registerEnumType(GrantStatus, { name: 'GrantStatus' })
registerEnumType(GrantAvailability, { name: 'GrantAvailability' })

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

  @CacheField(() => ReferenceLink, { nullable: true })
  applicationUrl?: ReferenceLink

  @Field({ nullable: true })
  applicationButtonLabel?: string

  @CacheField(() => [SliceUnion])
  specialEmphasis?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  whoCanApply?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  howToApply?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  answeringQuestions?: Array<typeof SliceUnion>

  @CacheField(() => [SliceUnion])
  applicationHints?: Array<typeof SliceUnion>

  @Field({ nullable: true })
  dateFrom?: string

  @Field({ nullable: true })
  dateTo?: string

  @CacheField(() => GrantStatus, { nullable: true })
  status?: GrantStatus

  @Field({ nullable: true })
  statusText?: string

  @Field({ nullable: true })
  statusIsAutomatic?: boolean

  @CacheField(() => GrantAvailability, { nullable: true })
  availability?: GrantAvailability

  @CacheField(() => [Asset], { nullable: true })
  files?: Array<Asset>

  @CacheField(() => [Link], { nullable: true })
  supportLinks?: Array<Link>

  @CacheField(() => [GenericTag], { nullable: true })
  categoryTags?: Array<GenericTag>

  @CacheField(() => GenericTag, { nullable: true })
  typeTag?: GenericTag

  @CacheField(() => Fund, { nullable: true })
  fund?: Fund
}

const parseStatus = (
  fields: IGrantFields,
): { status: GrantStatus; availability: GrantAvailability } => {
  switch (fields.grantStatus) {
    case 'Automatic': {
      const dateTo = parseDate(fields.grantDateTo, fields.grantOpenToHour)
      const dateFrom = parseDate(fields.grantDateFrom, fields.grantOpenFromHour)

      if (!dateTo || !dateFrom) {
        return {
          status: GrantStatus.INVALID,
          availability: GrantAvailability.UNKNOWN,
        }
      }

      const parsedDateTo = new Date(dateTo)
      const parsedDateFrom = new Date(dateFrom)

      if (!isValidDate(parsedDateTo) || !isValidDate(parsedDateFrom)) {
        return {
          status: GrantStatus.INVALID,
          availability: GrantAvailability.UNKNOWN,
        }
      }

      const today = new Date()

      //opens soon!
      if (today < parsedDateFrom) {
        const status = fields.grantFromDateIsEstimated
          ? GrantStatus.CLOSED_OPENING_SOON_WITH_ESTIMATION
          : GrantStatus.CLOSED_OPENING_SOON
        return {
          status,
          availability: GrantAvailability.CLOSED,
        }
      }
      if (today < parsedDateTo) {
        return {
          status: GrantStatus.OPEN,
          availability: GrantAvailability.OPEN,
        }
      }
      return {
        status: GrantStatus.CLOSED,
        availability: GrantAvailability.CLOSED,
      }
    }
    case 'Always open':
      return {
        status: GrantStatus.ALWAYS_OPEN,
        availability: GrantAvailability.OPEN,
      }
    case 'Closed with note':
      return {
        status: GrantStatus.CLOSED_WITH_NOTE,
        availability: GrantAvailability.CLOSED,
      }
    case 'Open with note':
      return {
        status: GrantStatus.OPEN_WITH_NOTE,
        availability: GrantAvailability.OPEN,
      }
    default:
      return {
        status: GrantStatus.UNKNOWN,
        availability: GrantAvailability.UNKNOWN,
      }
  }
}

const parseDate = (date?: string, time?: number): string | undefined => {
  if (!date) {
    return
  }
  const parsedDate = new Date(date)
  if (!time) {
    return format(parsedDate, 'yyyy-MM-dd')
  }
  return addHours(parsedDate, time).toISOString()
}

export const mapGrant = ({ fields, sys }: IGrant): Grant => {
  const status = parseStatus(fields)
  return {
    id: sys.id,
    name: fields.grantName,
    description: fields.grantDescription,
    applicationId: fields.grantApplicationId,
    applicationUrl: fields.granApplicationUrl?.fields
      ? mapReferenceLink(fields.granApplicationUrl)
      : undefined,
    applicationButtonLabel: fields.grantButtonLabel,
    specialEmphasis: fields.grantSpecialEmphasis
      ? mapDocument(fields.grantSpecialEmphasis, sys.id + ':special-emphasis')
      : [],
    whoCanApply: fields.grantWhoCanApply
      ? mapDocument(fields.grantWhoCanApply, sys.id + ':who-can-apply')
      : [],
    howToApply: fields.grantHowToApply
      ? mapDocument(fields.grantHowToApply, sys.id + ':how-to-apply')
      : [],
    applicationHints: fields.grantApplicationHints
      ? mapDocument(fields.grantApplicationHints, sys.id + ':application-hints')
      : [],
    answeringQuestions: fields.grantAnsweringQuestions
      ? mapDocument(
          fields.grantAnsweringQuestions,
          sys.id + ':answering-questions',
        )
      : [],
    dateFrom: parseDate(fields.grantDateFrom, fields.grantOpenFromHour),
    dateTo: parseDate(fields.grantDateTo, fields.grantOpenToHour),
    status: status.status,
    statusText: fields.grantStatusNote,
    statusIsAutomatic: fields.grantStatus === 'Automatic',
    availability: status.availability,
    fund: fields.grantFund ? mapFund(fields.grantFund) : undefined,
    files: (fields.grantFiles ?? []).map((file) => mapAsset(file)) ?? [],
    supportLinks:
      (fields.grantSupportLinks ?? []).map((link) => mapLink(link)) ?? [],
    categoryTags: fields.grantCategoryTags
      ? fields.grantCategoryTags.map((tag) => mapGenericTag(tag))
      : undefined,
    typeTag: fields.grantTypeTag
      ? mapGenericTag(fields.grantTypeTag)
      : undefined,
  }
}
