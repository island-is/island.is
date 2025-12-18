import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import {
  Box,
  Button,
  Hyphen,
  LinkV2,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import type {
  ConnectedComponent,
  GetVerdictsQuery,
  GetVerdictsQueryVariables,
} from '@island.is/web/graphql/schema'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { GET_VERDICTS_QUERY } from '@island.is/web/screens/queries/Verdicts'
import { InfoCardGrid } from '@island.is/web/screens/Verdicts/components/InfoCardGrid'

import { m } from './translation.strings'

interface LatestVerdictsProps {
  slice: ConnectedComponent
}

const DATE_FORMAT = 'd. MMMM yyyy'
const DEFAULT_MAX_VERDICTS_TO_SHOW = 3
const MAX_ALLOWED_VERDICTS_TO_SHOW = 6

const LatestVerdicts = ({ slice }: LatestVerdictsProps) => {
  const { format } = useDateUtils()
  const { formatMessage } = useIntl()

  const { data, loading, error } = useQuery<
    GetVerdictsQuery,
    GetVerdictsQueryVariables
  >(GET_VERDICTS_QUERY, {
    variables: {
      input: slice.configJson?.input ?? {},
    },
    onError(error) {
      console.error(error)
    },
  })

  if (error) return null

  let maxVerdictsToShow =
    slice.configJson?.maxVerdictsToShow ?? DEFAULT_MAX_VERDICTS_TO_SHOW
  if (maxVerdictsToShow > MAX_ALLOWED_VERDICTS_TO_SHOW)
    maxVerdictsToShow = MAX_ALLOWED_VERDICTS_TO_SHOW

  const items =
    data?.webVerdicts?.items
      ?.filter((verdict) => Boolean(verdict.id))
      .slice(0, maxVerdictsToShow) ?? []

  return (
    <Stack space={5}>
      <Stack space={3}>
        <Stack space={3}>
          {slice.title && (
            <Text variant="h2" as="h2">
              <Hyphen>{slice.title}</Hyphen>
            </Text>
          )}
          {loading && (
            <SkeletonLoader
              height={165}
              width="100%"
              borderRadius="large"
              repeat={maxVerdictsToShow}
              space={3}
            />
          )}
        </Stack>
        {items.length > 0 && (
          <Stack space={3}>
            <Stack space={5}>
              <InfoCardGrid
                variant="detailed-reveal"
                columns={1}
                cards={items.map((verdict) => {
                  const detailLines = [
                    {
                      icon: 'calendar',
                      text: verdict.verdictDate
                        ? format(new Date(verdict.verdictDate), DATE_FORMAT)
                        : '',
                    },
                    { icon: 'hammer', text: verdict.court ?? '' },
                  ]

                  if (verdict.presidentJudge?.name) {
                    detailLines.push({
                      icon: 'person',
                      text: `${verdict.presidentJudge?.name ?? ''} ${
                        verdict.presidentJudge?.title ?? ''
                      }`,
                    })
                  }

                  return {
                    description: verdict.title,
                    eyebrow: '',
                    id: verdict.id,
                    link: { href: `/domar/${verdict.id}`, label: '' },
                    title: verdict.caseNumber,
                    subDescription: verdict.keywords.join(', '),
                    borderColor: 'blue200',
                    detailLines,
                  }
                })}
              />
              <Box display="flex" justifyContent="flexEnd">
                <LinkV2 href={slice.json?.seeMoreVerdictsHref || '/domar'}>
                  <Button
                    icon="arrowForward"
                    iconType="filled"
                    variant="text"
                    as="span"
                    unfocusable={true}
                  >
                    {formatMessage(m.seeMoreVerdicts)}
                  </Button>
                </LinkV2>
              </Box>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default LatestVerdicts
