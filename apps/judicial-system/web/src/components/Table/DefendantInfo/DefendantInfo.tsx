import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDOB } from '@island.is/judicial-system/formatters'
import { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

import * as styles from './DefendantInfo.css'

interface Props {
  defendants?: Defendant[]
}

const DefendantInfo: React.FC<React.PropsWithChildren<Props>> = ({
  defendants,
}) => {
  return defendants && defendants.length > 0 ? (
    <>
      <Text>
        <Box component="span" className={styles.blockColumn}>
          {defendants[0].name ?? '-'}
        </Box>
      </Text>
      {defendants.length === 1 ? (
        (!defendants[0].noNationalId || defendants[0].nationalId) && (
          <Text>
            <Text as="span" variant="small" color="dark400">
              {formatDOB(defendants[0].nationalId, defendants[0].noNationalId)}
            </Text>
          </Text>
        )
      ) : (
        <Text as="span" variant="small" color="dark400">
          {`+ ${defendants.length - 1}`}
        </Text>
      )}
    </>
  ) : (
    <Text>-</Text>
  )
}

export default DefendantInfo
