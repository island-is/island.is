import { InfoCardGrid } from '@island.is/island-ui/core'
import { LastCallsForGrants as LastCallsForGrantsSchema } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import { TranslationKeys } from './types'
import { formatDate, getTranslationString } from './utils'

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

  console.log(slice)
  return (
    <InfoCardGrid
      variant="simple"
      columns={1}
      cards={grantItems.map((grant) => {
        const date =
          (grant.dateTo && formatDate(new Date(grant.dateTo), activeLocale)) ||
          ''
        return {
          id: grant.id,
          title: grant.name,
          borderColor: 'blue400',
          description: grant.description ?? '',
          eyebrow: date,
          link: {
            label: getTranslation('seeMore'),
            href: linkResolver(
              'grantsplazagrant',
              [grant?.applicationId ?? ''],
              activeLocale,
            ).href,
          },
        }
      })}
    />
  )
}

export default LastCallsForGrants
