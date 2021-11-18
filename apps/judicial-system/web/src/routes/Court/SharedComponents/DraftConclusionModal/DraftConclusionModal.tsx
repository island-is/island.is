import React from 'react'
import type { Case } from '@island.is/judicial-system/types'
import { AnimatePresence } from 'framer-motion'
import {
  ConclusionDraft,
  Modal,
} from '@island.is/judicial-system-web/src/components'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isDraftingConclusion: boolean | undefined
  setIsDraftingConclusion: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >
}

const DraftConclusionModal: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    isDraftingConclusion,
    setIsDraftingConclusion,
  } = props

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
          primaryButtonText="Loka glugga"
          handlePrimaryButtonClick={() => setIsDraftingConclusion(false)}
        />
      )}
    </AnimatePresence>
  )
}

export default DraftConclusionModal
