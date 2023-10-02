import React from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { core } from '@island.is/judicial-system-web/messages'
import {
  ConclusionDraft,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isDraftingConclusion: boolean | undefined
  setIsDraftingConclusion: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >
}

const DraftConclusionModal: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const {
    workingCase,
    setWorkingCase,
    isDraftingConclusion,
    setIsDraftingConclusion,
  } = props
  const { formatMessage } = useIntl()

  return (
    <AnimatePresence>
      {isDraftingConclusion && (
        <Modal
          title="Skrifa drög að niðurstöðu"
          text={
            <ConclusionDraft
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
            />
          }
          primaryButtonText={formatMessage(core.closeModal)}
          onPrimaryButtonClick={() => setIsDraftingConclusion(false)}
        />
      )}
    </AnimatePresence>
  )
}

export default DraftConclusionModal
