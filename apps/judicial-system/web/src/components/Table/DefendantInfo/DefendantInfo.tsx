import { FC, useContext } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import {
  formatDOB,
  normalizeAndFormatNationalId,
} from '@island.is/judicial-system/formatters'
import { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import { UserContext } from '@island.is/judicial-system-web/src/components'

import * as styles from './DefendantInfo.css'

interface Props {
  defendants?: Defendant[] | null
}

const DefendantInfo: FC<Props> = ({ defendants }) => {
  const { user } = useContext(UserContext)

  const visibleDefendants = defendants?.filter((defendant) => {
    const defenderDefendants = defendants.filter(
      (d) =>
        d.defenderNationalId &&
        normalizeAndFormatNationalId(user?.nationalId).includes(
          d.defenderNationalId,
        ),
    )

    const allDefenderDefendantsAreCancelledOrDismissed =
      defenderDefendants.length > 0 &&
      defenderDefendants.every(
        (d) => d.indictmentCancelledOrDismissedState != null,
      )

    if (allDefenderDefendantsAreCancelledOrDismissed) {
      return defenderDefendants.some((d) => d.id === defendant.id)
    }

    return defendant.indictmentCancelledOrDismissedState == null
  })

  return visibleDefendants && visibleDefendants.length > 0 ? (
    <>
      <Text>
        <Box component="span" className={styles.blockColumn}>
          {visibleDefendants[0].name ?? '-'}
        </Box>
      </Text>
      {visibleDefendants.length === 1 ? (
        (!visibleDefendants[0].noNationalId ||
          visibleDefendants[0].nationalId) && (
          <Text>
            <Text as="span" variant="small" color="dark400">
              {formatDOB(
                visibleDefendants[0].nationalId,
                visibleDefendants[0].noNationalId,
              )}
            </Text>
          </Text>
        )
      ) : (
        <Text as="span" variant="small" color="dark400">
          {`+ ${visibleDefendants.length - 1}`}
        </Text>
      )}
    </>
  ) : (
    <Text>-</Text>
  )
}

export default DefendantInfo
