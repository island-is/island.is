import format from 'date-fns/format'
import localeEN from 'date-fns/locale/en-GB'
import localeIS from 'date-fns/locale/is'
import { useRouter } from 'next/router'

import { ActionCard, Box, InfoCardGrid } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import {
  Grant,
  GrantCardsList as GrantCardsListSchema,
  GrantStatus,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import { TranslationKeys } from './types'

interface SliceProps {
  slice: GrantCardsListSchema
}

const formatDate = (
  date: Date,
  locale: Locale,
  stringFormat = 'dd. MMMM yyyy',
): string | undefined => {
  try {
    return format(date, stringFormat, {
      locale: locale === 'is' ? localeIS : localeEN,
    })
  } catch (e) {
    console.warn('Error formatting date')
    return
  }
}

const containsTimePart = (date: string) => date.includes('T')

const GrantCardsList = ({ slice }: SliceProps) => {
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()
  const router = useRouter()

  const namespace = slice.namespace

  const getTranslationString = (
    key: keyof TranslationKeys,
    argToInterpolate?: string,
  ) =>
    argToInterpolate
      ? namespace[key].replace('{arg}', argToInterpolate)
      : namespace[key]

  const parseStatus = (grant: Grant): string | undefined => {
    switch (grant.status) {
      case GrantStatus.Closed: {
        const date = grant.dateTo
          ? formatDate(new Date(grant.dateTo), activeLocale)
          : undefined
        return date
          ? getTranslationString(
              containsTimePart(date)
                ? 'applicationWasOpenToAndWith'
                : 'applicationWasOpenTo',
              date,
            )
          : getTranslationString('applicationClosed')
      }
      case GrantStatus.ClosedOpeningSoon: {
        const date = grant.dateFrom
          ? formatDate(new Date(grant.dateFrom), activeLocale)
          : undefined
        return date
          ? getTranslationString('applicationOpensAt', date)
          : getTranslationString('applicationClosed')
      }
      case GrantStatus.ClosedOpeningSoonWithEstimation: {
        const date = grant.dateFrom
          ? formatDate(new Date(grant.dateFrom), activeLocale, 'MMMM yyyy')
          : undefined
        return date
          ? getTranslationString('applicationEstimatedOpensAt', date)
          : getTranslationString('applicationClosed')
      }
      case GrantStatus.AlwaysOpen: {
        return getTranslationString('applicationAlwaysOpen')
      }
      case GrantStatus.Open: {
        const date = grant.dateTo
          ? formatDate(new Date(grant.dateTo), activeLocale, 'dd. MMMM.')
          : undefined
        return date
          ? getTranslationString(
              containsTimePart(date)
                ? 'applicationOpensToWithDay'
                : 'applicationOpensTo',
              date,
            )
          : getTranslationString('applicationOpen')
      }
      case GrantStatus.ClosedWithNote:
      case GrantStatus.OpenWithNote: {
        return getTranslationString('applicationSeeDescription')
      }
      default:
        return
    }
  }

  if (slice.resolvedGrantsList?.items.length === 1) {
    const grant = slice.resolvedGrantsList.items[0]
    return (
      <ActionCard
        heading={grant.name}
        backgroundColor="blue"
        cta={{
          disabled: !grant.applicationUrl?.slug,
          label: grant.applicationButtonLabel ?? getTranslationString('apply'),
          onClick: () => router.push(grant.applicationUrl?.slug ?? ''),
          icon: 'open',
          iconType: 'outline',
        }}
      />
    )
  }

  const cards = slice.resolvedGrantsList?.items
    ?.map((grant) => {
      if (grant.id) {
        return {
          id: grant.id,
          eyebrow: grant.fund?.title ?? grant.name ?? '',
          subEyebrow: grant.fund?.parentOrganization?.title,
          title: grant.name ?? '',
          description: grant.description ?? '',
          logo:
            grant.fund?.featuredImage?.url ??
            grant.fund?.parentOrganization?.logo?.url ??
            '',
          logoAlt:
            grant.fund?.featuredImage?.title ??
            grant.fund?.parentOrganization?.logo?.title ??
            '',
          link: {
            label: getTranslationString('applicationClosed'),
            href: linkResolver(
              'grantsplazagrant',
              [grant?.applicationId ?? ''],
              activeLocale,
            ).href,
          },
          detailLines: [
            grant.dateFrom && grant.dateTo
              ? {
                  icon: 'calendar' as const,
                  text: `${format(
                    new Date(grant.dateFrom),
                    'dd.MM.yyyy',
                  )} - ${format(new Date(grant.dateTo), 'dd.MM.yyyy')}`,
                }
              : null,
            grant.status
              ? {
                  icon: 'time' as const,
                  text: parseStatus(grant),
                }
              : undefined,
            grant.categoryTags
              ? {
                  icon: 'informationCircle' as const,
                  text: grant.categoryTags
                    .map((ct) => ct.title)
                    .filter(isDefined)
                    .join(', '),
                }
              : undefined,
          ].filter(isDefined),
        }
      }
      return null
    })
    .filter(isDefined)

  return (
    <Box padding={1} borderColor="blue100" borderRadius="large">
      <InfoCardGrid
        columns={1}
        cardsBorder="blue200"
        variant="detailed"
        cards={cards ?? []}
      />
    </Box>
  )
}

export default GrantCardsList
