import format from 'date-fns/format'
import { useRouter } from 'next/router'

import { ActionCard, Box, InfoCardGrid, Text } from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import {
  Grant,
  GrantCardsList as GrantCardsListSchema,
  GrantCardsListSorting,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import { TranslationKeys } from './types'
import { getTranslationString, isGrantOpen, parseGrantStatus } from './utils'

interface SliceProps {
  slice: GrantCardsListSchema
}
const GrantCardsList = ({ slice }: SliceProps) => {
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()
  const router = useRouter()

  const getTranslation = (
    key: keyof TranslationKeys,
    argToInterpolate?: string,
  ) => getTranslationString(key, slice.namespace, argToInterpolate)

  const parseStatus = (grant: Grant) =>
    parseGrantStatus(grant, activeLocale, getTranslation)

  const grantItems = [...(slice.resolvedGrantsList?.items ?? [])]

  if (grantItems.length === 1 && !slice.alwaysDisplayResultsAsCards) {
    const grant = grantItems[0]

    const grantStatus = isGrantOpen(grant)

    const cardText =
      grantStatus !== 'unknown'
        ? `${getTranslation(
            grantStatus === 'open' ? 'applicationOpen' : 'applicationClosed',
          )} / ${parseStatus(grant)}`
        : undefined

    return (
      <>
        {slice.displayTitle && (
          <Box marginBottom={2}>
            <Text variant="h3" as="h3" color="dark400">
              {slice.title}
            </Text>
          </Box>
        )}
        <ActionCard
          heading={grant.name}
          text={cardText}
          backgroundColor="blue"
          cta={{
            disabled: isGrantOpen(grant) !== 'open',
            size: 'small',
            label: grant.applicationButtonLabel ?? getTranslation('apply'),
            onClick: () => router.push(grant.applicationUrl?.slug ?? ''),
            icon: 'open',
            iconType: 'outline',
          }}
        />
      </>
    )
  }

  if (grantItems.length > 1) {
    if (slice.sorting === GrantCardsListSorting.MostRecentlyUpdatedFirst) {
      grantItems.sort(
        (a, b) =>
          new Date(a.lastUpdateTimestamp).getTime() -
          new Date(b.lastUpdateTimestamp).getTime(),
      )
    } else if (slice.sorting === GrantCardsListSorting.Alphabetical) {
      grantItems.sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  const cards = grantItems
    ?.map((grant) => {
      const grantIsOpen = isGrantOpen(grant)
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
            label: getTranslation('applicationClosed'),
            href: linkResolver(
              'grantsplazagrant',
              [grant?.applicationId ?? ''],
              activeLocale,
            ).href,
          },
          tags: [
            grantIsOpen !== 'unknown'
              ? {
                  label: getTranslation(
                    grantIsOpen === 'open'
                      ? 'applicationOpen'
                      : 'applicationClosed',
                  ),
                  variant: grantIsOpen === 'open' ? 'mint' : 'rose',
                }
              : undefined,
          ].filter(isDefined),
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
    <>
      {slice.displayTitle && (
        <Box marginBottom={2}>
          <Text variant="h3" as="h3" color="dark400">
            {slice.title}
          </Text>
        </Box>
      )}
      <InfoCardGrid
        columns={1}
        cardsBorder="blue200"
        variant="detailed"
        cards={cards ?? []}
      />
    </>
  )
}

export default GrantCardsList
