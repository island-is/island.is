import format from 'date-fns/format'

import { Box, InfoCardGrid, Text } from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import { LastCallsForGrants as LastCallsForGrantsSchema } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import { TranslationKeys } from './types'
import { getTranslationString, isGrantOpen, parseGrantStatus } from './utils'

interface SliceProps {
  slice: LastCallsForGrantsSchema
}

const LastCallsForGrants = ({ slice }: SliceProps) => {
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()

  const getTranslation = (
    key: keyof TranslationKeys,
    argToInterpolate?: string,
  ) => getTranslationString(key, slice.namespace, argToInterpolate)

  const grantItems = [...(slice.resolvedGrantsList?.items ?? [])]

  return (
    <Box>
      <Text marginBottom={1} variant="h3">
        {slice.title}
      </Text>
      <InfoCardGrid
        variant="detailed"
        columns={1}
        cardsBorder="blue200"
        cards={grantItems.map((grant) => {
          const status = parseGrantStatus(grant, activeLocale, getTranslation)
          const grantIsOpen = isGrantOpen(grant) === 'open'
          return {
            id: grant.id,
            title: grant.name,
            eyebrow: grant.fund?.title ?? grant.name ?? '',
            subEyebrow: grant.fund?.parentOrganization?.title,
            description: '',
            tags: status
              ? [
                  {
                    label: status,
                    variant: grantIsOpen ? 'mint' : 'rose',
                  },
                ]
              : undefined,
            logo:
              grant.fund?.featuredImage?.url ??
              grant.fund?.parentOrganization?.logo?.url ??
              '',
            logoAlt:
              grant.fund?.featuredImage?.title ??
              grant.fund?.parentOrganization?.logo?.title ??
              '',
            link: {
              label: getTranslation('seeMore'),
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
        })}
      />
    </Box>
  )
}

export default LastCallsForGrants
