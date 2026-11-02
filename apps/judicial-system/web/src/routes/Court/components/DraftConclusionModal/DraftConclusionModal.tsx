import type { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'

import { core } from '@island.is/judicial-system-web/messages'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  ConclusionDraft,
  Modal,
} from '@island.is/judicial-system-web/src/components'

interface Props {
  workingCase: WorkingCase
  setWorkingCase: Dispatch<SetStateAction<WorkingCase>>
  isDraftingConclusion: boolean | undefined
  setIsDraftingConclusion: Dispatch<SetStateAction<boolean | undefined>>
}

const DraftConclusionModal: FC<Props> = ({
  workingCase,
  setWorkingCase,
  isDraftingConclusion,
  setIsDraftingConclusion,
}) => {
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
          buttons={[
            {
              text: formatMessage(core.closeModal),
              onClick: () => setIsDraftingConclusion(false),
            },
          ]}
        />
      )}
    </AnimatePresence>
  )
}

export default DraftConclusionModal
