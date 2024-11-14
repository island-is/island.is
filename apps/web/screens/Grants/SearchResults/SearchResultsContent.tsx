import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import format from 'date-fns/format'
import { useRouter } from 'next/router'

import { Box, Inline, TagVariant, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Locale } from '@island.is/shared/types'
import { isDefined } from '@island.is/shared/utils'
import { PlazaCard } from '@island.is/web/components'
import { Grant, GrantStatus } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'

import { m } from '../messages'

interface Props {
  grants?: Array<Grant>
  subheader?: React.ReactNode
  locale?: Locale
}

export const SearchResultsContent = ({ grants, subheader, locale }: Props) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { linkResolver } = useLinkResolver()

  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md
  const isTablet = width <= theme.breakpoints.lg && width > theme.breakpoints.md

  return (
    <>
      {!isMobile && (
        <Box marginBottom={3}>
          <Text>{subheader}</Text>
        </Box>
      )}
      {grants?.length ? (
        <Inline space={3} justifyContent={isMobile ? 'center' : undefined}>
          {grants?.map((grant) => {
            if (!grant) {
              return null
            }

            let tagVariant: TagVariant | undefined
            switch (grant.status) {
              case GrantStatus.Open:
                tagVariant = 'mint'
                break
              case GrantStatus.Closed:
                tagVariant = 'rose'
                break
              case GrantStatus.OpensSoon:
                tagVariant = 'purple'
                break
              default:
                break
            }

            return (
              <Box key={grant.id}>
                {grant.applicationId && (
                  <PlazaCard
                    eyebrow={grant.fund?.title ?? grant.name ?? ''}
                    subEyebrow={grant.fund?.parentOrganization?.title}
                    title={grant.name ?? ''}
                    text={grant.description ?? ''}
                    logo={grant.fund?.parentOrganization?.logo?.url ?? ''}
                    logoAlt={grant.fund?.parentOrganization?.logo?.title ?? ''}
                    tag={{
                      label: grant.statusText ?? '',
                      variant: tagVariant,
                    }}
                    cta={{
                      label: formatMessage(m.general.seeMore),
                      variant: 'text',
                      onClick: () => {
                        router.push(
                          linkResolver(
                            'styrkjatorggrant',
                            [grant?.applicationId ?? ''],
                            locale,
                          ).href,
                        )
                      },
                      icon: 'arrowForward',
                    }}
                    detailLines={[
                      grant.dateFrom && grant.dateTo
                        ? {
                            icon: 'calendar' as const,
                            text: `${format(
                              new Date(grant.dateFrom),
                              'dd.MM.',
                            )}-${format(new Date(grant.dateTo), 'dd.MM.yyyy')}`,
                          }
                        : null,
                      {
                        icon: 'time' as const,
                        //todo: fix when the text is ready
                        text: 'Frestur til 16.08.2024, kl. 15.00',
                      },
                      grant.categoryTag?.title
                        ? {
                            icon: 'informationCircle' as const,
                            text: grant.categoryTag.title,
                          }
                        : undefined,
                    ].filter(isDefined)}
                  />
                )}
              </Box>
            )
          })}
        </Inline>
      ) : undefined}
      {!grants?.length && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          background="white"
          borderWidth="standard"
          borderRadius="xl"
          borderColor="blue200"
          flexDirection={['columnReverse', 'columnReverse', 'row']}
          columnGap={[2, 4, 8, 8, 20]}
          paddingY={[5, 8]}
          paddingX={[3, 3, 5, 10]}
          rowGap={[7, 7, 0]}
        >
          <Box display="flex" flexDirection="column" rowGap={1}>
            <Text variant={'h3'} as={'h3'} color="dark400">
              {formatMessage(m.search.noResultsFound)}
            </Text>
          </Box>
          {!(isTablet || isMobile) && (
            <img
              width="240"
              src="/assets/sofa.svg"
              alt={formatMessage(m.search.noResultsFound)}
            />
          )}
        </Box>
      )}
    </>
  )
}
