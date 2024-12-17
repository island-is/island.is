import format from 'date-fns/format'

import { Box, InfoCardGrid } from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import { GrantCardsList as GrantCardsListSchema } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

interface SliceProps {
  slice: GrantCardsListSchema
}

const GrantCardsList = ({ slice }: SliceProps) => {
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()

  if (!slice.funds) {
    return undefined
  }

  const cards = data?.getGrants?.items
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
            label: 'Skoða nánar',
            href: linkResolver(
              'styrkjatorggrant',
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
                  //todo: fix when the text is ready
                  text: generateStatus(grant?.status),
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
      <InfoCardGrid columns={1} variant="detailed" cards={cards ?? []} />
    </Box>
  )
}

export default GrantCardsList
