import { Box, InfoCardGrid, Text } from '@island.is/island-ui/core'
import {
  Grant,
  LastCallsForGrants as LastCallsForGrantsSchema,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import { TranslationKeys } from './types'
import { getTranslationString, parseGrantStatus } from './utils'

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

  const getStatus = (grant: Grant) =>
    parseGrantStatus(grant, activeLocale, getTranslation)

  return (
    <Box>
      <Text marginBottom={1} variant="h3">
        {slice.title}
      </Text>
      <InfoCardGrid
        variant="detailed"
        columns={2}
        cardsBorder="blue200"
        cards={grantItems.map((grant) => ({
          id: grant.id,
          title: grant.name,
          eyebrow: grant.fund?.title ?? '',
          description: getStatus(grant) ?? '',
          link: {
            label: getTranslation('seeMore'),
            href: linkResolver(
              'grantsplazagrant',
              [grant?.applicationId ?? ''],
              activeLocale,
            ).href,
          },
        }))}
      ></InfoCardGrid>
    </Box>
  )
}

export default LastCallsForGrants
