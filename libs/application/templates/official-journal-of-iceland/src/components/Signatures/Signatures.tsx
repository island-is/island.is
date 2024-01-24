import { Box, Tabs } from '@island.is/island-ui/core'
import {
  CommitteeSignatureState,
  OJOIFieldBaseProps,
  RegularSignatureState,
} from '../../lib/types'
import { useFormatMessage } from '../../hooks'
import { newCase } from '../../lib/messages'

import * as styles from './Signatures.css'
import { RegularSignature } from './Regular'
import { TabLabel } from '../../fields/NewCase/SignatureSection'

type Props = Pick<OJOIFieldBaseProps, 'application' | 'errors'> & {
  selectedTab: TabLabel
  setSelectedTab: (tab: TabLabel) => void
  regularState: RegularSignatureState
  setRegularState: (state: RegularSignatureState) => void
  committeeState: CommitteeSignatureState
  setCommitteeState: (state: CommitteeSignatureState) => void
}

export const Signatures = ({
  selectedTab,
  setSelectedTab,
  application,
  errors,
  regularState,
  setRegularState,
  committeeState,
  setCommitteeState,
}: Props) => {
  const { f } = useFormatMessage(application)

  const tabs = [
    {
      id: 'regular',
      label: f(newCase.tabs.regular.label),
      content: (
        <Box className={styles.tabWrapper}>
          <RegularSignature
            addSignature
            state={regularState}
            setState={setRegularState}
          />
        </Box>
      ),
    },
    {
      id: 'committee',
      label: f(newCase.tabs.committee.label),
      content: <Box className={styles.tabWrapper}>Committee</Box>,
    },
  ]

  return (
    <Tabs
      selected="regular"
      onChange={(id) => setSelectedTab(id as TabLabel)}
      label="Hello"
      tabs={tabs}
    />
  )
}
