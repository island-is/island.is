import { Box, Inline, FocusableBox } from '@island.is/island-ui/core'
import { Dispatch, SetStateAction } from 'react'
import * as styles from './tabs.css'

interface Props {
  selectedTab: number
  setSelectedTab: Dispatch<SetStateAction<number>>
  // allTemp: IApplicationTemplate[]
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
          {/* {`Óútgefið (${allTemp.filter(t => t.status == 0).length})`} */}
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
          {/* {`Útgefið í breytingu (${allTemp.filter(t => t.status == 1).length})`} */}
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
          {/* {`Útgefið (${allTemp.filter(t => t.status == 2).length})`} */}
          Útgefið
        </FocusableBox>
      </Inline>
    </Box>
  )
}
