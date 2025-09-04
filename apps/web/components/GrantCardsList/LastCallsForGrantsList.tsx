import { useRouter } from 'next/router'

import { ActionCard,Stack } from '@island.is/island-ui/core'
import { Grant, LastCallsForGrants as LastCallsForGrantsSchema } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

import { TranslationKeys } from './types'
import { getTranslationString, parseGrantStatus } from './utils'

interface SliceProps {
  slice: LastCallsForGrantsSchema
}

const LastCallsForGrants = ({ slice }: SliceProps) => {
  const { activeLocale } = useI18n()
  const router = useRouter()


  const getTranslation = (
    key: keyof TranslationKeys,
    argToInterpolate?: string,
  ) => getTranslationString(key, slice.namespace, argToInterpolate)

  const grantItems = [...(slice.resolvedGrantsList?.items ?? [])]

  const getStatus = (grant: Grant) => parseGrantStatus(grant, activeLocale, getTranslation)

  return (
    <Stack space={1}>
      {grantItems.map(grant => {
        const status = getStatus(grant)
        console.log(status)
        return <ActionCard
          heading={grant.name}
          text={status}
          cta={{
            label: getTranslation('seeMore'),
            size: 'small',
            onClick: () => router.push(grant.applicationId ?? ''),
            variant: 'text',
            icon: 'open',
            iconType: 'outline',
          }}
        />
      }
  )}</Stack>)
}

export default LastCallsForGrants
