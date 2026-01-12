import { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'

import { core } from '@island.is/judicial-system-web/messages'
import {
  ConclusionDraft,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
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
          primaryButton={{
            text: formatMessage(core.closeModal),
            onClick: () => setIsDraftingConclusion(false),
          }}
        />
      )}
    </AnimatePresence>
  )
}

export default DraftConclusionModal
