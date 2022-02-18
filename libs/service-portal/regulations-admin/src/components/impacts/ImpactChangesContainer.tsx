import React from 'react'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { Effects } from '../../types'
import { DraftCancelForm } from '../../state/types'
import { nameToSlug, RegName } from '@island.is/regulations'
import { format } from 'date-fns' // eslint-disable-line no-restricted-imports
import { is } from 'date-fns/locale' // eslint-disable-line no-restricted-imports

export type ImpactChangesContainerProps = {
  effects?: Effects
  activeCancellation?: DraftCancelForm
}

export const ImpactChangesContainer = (props: ImpactChangesContainerProps) => {
  const { effects, activeCancellation } = props
  const hasData = effects?.future && effects.future.length > 0
  const data = hasData && effects?.future

  return (
    <Box background="blueberry100" paddingY={3} paddingX={4} marginTop={10}>
      <Text variant="h4" color="blueberry600" marginBottom={3}>
        Breytingasaga reglugerðar
      </Text>
      <Divider />
      <Text variant="h5" color="blueberry600" paddingTop={3} marginBottom={3}>
        <a
          href={`https://island.is/reglugerdir/nr/${nameToSlug(
            activeCancellation?.name as RegName,
          )}`}
          // 'FIXME: target="_blank" is not working here?
          target="_blank"
          rel="noreferrer"
        >
          Nýjasta útgáfan
        </a>
      </Text>
      {data && data?.length > 0 ? (
        <>
          <Text variant="eyebrow" marginBottom={2}>
            Væntanlegar breytingar:
          </Text>
          {data.map((effect) => (
            <>
              <Text variant="h5" color="blueberry600">
                {format(new Date(effect.date), 'd. MMM yyyy', {
                  locale: is,
                })}
              </Text>
              <Text variant="small" color="blueberry600" marginBottom={2}>
                <a
                  href={`https://island.is/reglugerdir/nr/${nameToSlug(
                    activeCancellation?.name as RegName,
                  )}/d/${effect.date}/diff`}
                  // 'FIXME: target="_blank" is not working here?
                  target="_blank"
                  rel="noreferrer"
                >
                  Breytt af {effect.name}
                </a>
              </Text>
            </>
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
