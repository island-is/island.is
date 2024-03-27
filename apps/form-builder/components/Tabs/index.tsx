import { Box, Inline, FocusableBox } from '@island.is/island-ui/core'
import { Dispatch, SetStateAction } from 'react'
import * as styles from './tabs.css'

interface Props {
  selectedTab: number
  setSelectedTab: Dispatch<SetStateAction<number>>
}

export default function Tabs({ selectedTab, setSelectedTab }: Props) {
  return (
    <Box>
      <Inline space={4}>
        <FocusableBox
          type="button"
          justifyContent={'center'}
          className={
            selectedTab === 0 ? `${styles.tab} ${styles.selected}` : styles.tab
          }
          onClick={() => setSelectedTab(0)}
        >
          Óútgefið
        </FocusableBox>
        <FocusableBox
          type="button"
          justifyContent={'center'}
          className={
            selectedTab === 1 ? `${styles.tab} ${styles.selected}` : styles.tab
          }
          onClick={() => setSelectedTab(1)}
        >
          Útgefið
        </FocusableBox>
        <FocusableBox
          type="button"
          justifyContent={'center'}
          className={
            selectedTab === 2 ? `${styles.tab} ${styles.selected}` : styles.tab
          }
          onClick={() => setSelectedTab(2)}
        >
          Útgefið
        </FocusableBox>
      </Inline>
    </Box>
  )
}
