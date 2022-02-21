import React from 'react'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { Effects } from '../../types'
import { DraftCancelForm } from '../../state/types'
import { nameToSlug, RegName } from '@island.is/regulations'
import { useLocale } from '@island.is/localization'

export type ImpactChangesContainerProps = {
  effects?: Effects
  activeCancellation?: DraftCancelForm
}

export const ImpactChangesContainer = (props: ImpactChangesContainerProps) => {
  const { effects, activeCancellation } = props
  const { formatDateFns } = useLocale()
  const futureEffects = effects?.future ?? []

  return (
    <Box background="blueberry100" paddingY={3} paddingX={4} marginTop={10}>
      <Text variant="h4" color="blueberry600" marginBottom={3}>
        Breytingasaga reglugerðar
      </Text>
      <Divider />
      <a
        href={`https://island.is/reglugerdir/nr/${nameToSlug(
          activeCancellation?.name as RegName,
        )}`}
        target="_blank"
        rel="noreferrer"
      >
        <Text variant="h5" color="blueberry600" paddingTop={3} marginBottom={3}>
          Nýjasta útgáfan
        </Text>
      </a>
      {futureEffects.length > 0 ? (
        <>
          <Text variant="eyebrow" marginBottom={2}>
            Væntanlegar breytingar:
          </Text>
          {futureEffects.map((effect) => (
            <a
              href={`https://island.is/reglugerdir/nr/${nameToSlug(
                activeCancellation?.name as RegName,
              )}/d/${effect.date}/diff`}
              target="_blank"
              rel="noreferrer"
            >
              <Text variant="h5" color="blueberry600">
                {formatDateFns(effect.date, 'd. MMM yyyy')}
              </Text>
              <Text variant="small" color="blueberry600" marginBottom={2}>
                Breytt af {effect.name}
              </Text>
            </a>
          ))}
        </>
      ) : (
        <Text variant="h5" marginBottom={2}>
          Engar breytingar framundan
        </Text>
      )}
    </Box>
  )
}
