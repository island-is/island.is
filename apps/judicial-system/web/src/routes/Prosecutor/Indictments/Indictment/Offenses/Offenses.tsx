import { useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Box, Icon, Select, Tag } from '@island.is/island-ui/core'
import { IndictmentCountOffense } from '@island.is/judicial-system/types'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import { TempIndictmentCount } from '@island.is/judicial-system-web/src/types'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import { UpdateIndictmentCount } from '@island.is/judicial-system-web/src/utils/hooks'
import useOffenses from '@island.is/judicial-system-web/src/utils/hooks/useOffenses'

import { indictmentCount as strings } from '../IndictmentCount.strings'
import { indictmentCountEnum as enumStrings } from '../IndictmentCountEnum.strings'

// TODO: it seems like we need to commit to server AND update the case state
export const Offenses = ({
  workingCase,
  indictmentCount,
  handleIndictmentCountChanges,
}: {
  workingCase: Case
  indictmentCount: TempIndictmentCount
  handleIndictmentCountChanges: (update: UpdateIndictmentCount) => void
}) => {
  const { formatMessage } = useIntl()
  const { createOffense, deleteOffense } = useOffenses()

  const { offenses } = indictmentCount

  const offensesOptions = useMemo(
    () =>
      Object.values(IndictmentCountOffense).map((offense) => ({
        value: offense,
        label: formatMessage(enumStrings[offense]),
        disabled: offenses?.some((o) => o.offense === offense),
      })),
    [formatMessage, offenses],
  )


  return (
    <>
      <Box marginBottom={2}>
        <SectionHeading
          heading="h4"
          title={formatMessage(strings.incidentTitle)}
          marginBottom={2}
        />
        <Select
          name="offenses"
          options={offensesOptions}
          label={formatMessage(strings.incidentLabel)}
          placeholder={formatMessage(strings.incidentPlaceholder)}
          onChange={async (so) => {
            const selectedOffense = so?.value as IndictmentCountOffense
            const hasOffense = offenses?.some((o) => o.offense === selectedOffense)
            if (!hasOffense) {
              const offense = await createOffense(
                workingCase.id,
                indictmentCount.id,
                selectedOffense,
              )
            }
            // TODO: do we need to update some state as well? yes
          }}
          value={null}
          required
        />
      </Box>
      {isNonEmptyArray(offenses) && (
        <Box marginBottom={2}>
          {offenses.map(({ id: offenseId, offense }) => {
            if (!offense) {
              return null
            }
            return (
              <Box
                display="inlineBlock"
                key={`${indictmentCount.id}-${offenseId}-${offense}`}
                component="span"
                marginBottom={1}
                marginRight={1}
              >
                <Tag
                  variant="darkerBlue"
                  onClick={async () => {
                    await deleteOffense(
                      workingCase.id,
                      indictmentCount.id,
                      offenseId,
                    )

                    // TODO: update state
                    handleIndictmentCountChanges({
                      ...(offense === IndictmentCountOffense.SPEEDING && {
                        recordedSpeed: null,
                        speedLimit: null,
                      }),
                    })
                  }}
                >
                  <Box display="flex" alignItems="center">
                    {formatMessage(enumStrings[offense])}
                    <Icon icon="close" size="small" />
                  </Box>
                </Tag>
              </Box>
            )
          })}
        </Box>
      )}
    </>
  )
}
