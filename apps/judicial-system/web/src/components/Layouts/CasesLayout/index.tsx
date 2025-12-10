import { FC, PropsWithChildren } from 'react'

import { Box } from '@island.is/island-ui/core'

import * as styles from './index.css'

const CasesLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Box paddingX={[2, 2, 4]}>
        <Box
          className={styles.casesContainer}
          marginX={'auto'}
          marginY={[4, 4, 12]}
        >
          {children}
        </Box>
      </Box>
      {/* Here we will mount our modal portal */}
      <div id="modal" data-testid="modal" />
    </>
  )
}

export default CasesLayout
