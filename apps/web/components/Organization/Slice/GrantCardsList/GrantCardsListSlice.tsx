import format from 'date-fns/format'
import { useQuery } from '@apollo/client'

import { Box, InfoCardGrid } from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import {
  ContentLanguage,
  GrantCardsList,
  GrantStatus,
  Query,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { GET_GRANTS_QUERY } from '@island.is/web/screens/queries'

interface SliceProps {
  slice: GrantCardsList
  namespace?: Record<string, string>
}

const generateStatus = (grant: GrantStatus) => 'Opið fyrir umsóknir'

export const GrantCardsListSlice = ({ slice, namespace }: SliceProps) => {
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()
  const translations = useNamespace(namespace)

  const { data } = useQuery<Query>(GET_GRANTS_QUERY, {
    variables: {
      input: {
        lang: activeLocale as ContentLanguage,
        size: slice.maxNumberOfCards ?? 50,
        //funds: slice.funds ? slice.funds.map((f) => f.id).join(',') : undefined,
      },
    },
  })

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
