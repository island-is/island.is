import { Box, Tabs } from '@island.is/island-ui/core'
import {
  CommitteeSignatureState,
  InputFields,
  OJOIFieldBaseProps,
  RegularSignatureState,
  SignatureType,
} from '../../lib/types'
import { useFormatMessage } from '../../hooks'
import { newCase } from '../../lib/messages'

import * as styles from './Signatures.css'
import { RegularSignature } from './Regular'
import { CommitteeSignature } from './Committee'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'

type Props = Pick<OJOIFieldBaseProps, 'application' | 'errors'> & {
  selectedTab: SignatureType
  setSelectedTab: (tab: SignatureType) => void
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
  const { setValue } = useFormContext()

  useEffect(() => {
    setValue(InputFields.case.signatureType, selectedTab)
  }, [selectedTab])

  const tabs = [
    {
      id: 'regular',
      label: f(newCase.tabs.regular.label),
      content: (
        <Box className={styles.tabWrapper}>
          <RegularSignature
            state={regularState}
            errors={errors}
            setState={setRegularState}
          />
        </Box>
      ),
    },
    {
      id: 'committee',
      label: f(newCase.tabs.committee.label),
      content: (
        <Box className={styles.tabWrapper}>
          <CommitteeSignature
            errors={errors}
            state={committeeState}
            setState={setCommitteeState}
          />
        </Box>
      ),
    },
  ]

  return (
    <Tabs
      selected={selectedTab}
      onChange={(id) => setSelectedTab(id as SignatureType)}
      label="Hello"
      tabs={tabs}
    />
  )
}
