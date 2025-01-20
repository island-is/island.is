import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import format from 'date-fns/format'

import { Box, Button, InfoCardGrid, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { Grant, GrantStatus } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'

import { m } from '../messages'
import { generateStatusTag, parseStatus } from '../utils'

interface Props {
  grants?: Array<Grant>
  subheader?: React.ReactNode
  locale: Locale
}

export const SearchResultsContent = ({ grants, subheader, locale }: Props) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md

  const [isGridLayout, setIsGridLayout] = useState(true)

  return (
    <>
      {!isMobile && (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          marginBottom={3}
          marginRight={3}
        >
          <Text>{subheader}</Text>
          <Button
            variant="utility"
            icon={isGridLayout ? 'menu' : 'gridView'}
            iconType="filled"
            colorScheme="white"
            size="small"
            onClick={() => setIsGridLayout(!isGridLayout)}
          >
            {formatMessage(
              isGridLayout ? m.general.displayList : m.general.displayGrid,
            )}
          </Button>
        </Box>
      )}
      <InfoCardGrid
        columns={!isGridLayout ? 1 : 2}
        notFoundText={formatMessage(m.search.noResultsFound)}
        variant="detailed"
        cards={
          grants
            ?.map((grant) => {
              if (!grant || !grant.applicationId) {
                return null
              }

              const status = parseStatus(grant, formatMessage, locale)

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
                tags: status.applicationStatus
                  ? [
                      generateStatusTag(
                        status.applicationStatus,
                        formatMessage,
                      ),
                    ].filter(isDefined)
                  : undefined,
                link: {
                  label: formatMessage(m.general.seeMore),
                  href: linkResolver(
                    'styrkjatorggrant',
                    [grant?.applicationId ?? ''],
                    locale,
                  ).href,
                },
                detailLines: [
                  status.deadlineStatus
                    ? {
                        icon: 'time' as const,
                        text: status.deadlineStatus,
                      }
                    : undefined,
                  grant.status !==
                    GrantStatus.ClosedOpeningSoonWithEstimation &&
                  grant.dateFrom &&
                  grant.dateTo
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
            })
            .filter(isDefined) ?? []
        }
      />
    </>
  )
}
