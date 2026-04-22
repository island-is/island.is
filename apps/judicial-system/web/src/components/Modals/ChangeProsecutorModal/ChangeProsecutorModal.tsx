import React, { FC, useContext, useState } from 'react'

import {
  FormContext,
  Modal,
  ProsecutorSelection,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  onClose: () => void
  caseId: string
}

const ChangeProsecutorModal: FC<Props> = (props) => {
  const { onClose, caseId } = props
  const { updateCase } = useCase()
  const { refreshCase } = useContext(FormContext)

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false)
  const [prosecutorsCount, setProsecutorsCount] = useState<number>(0)
  const [selectedProsecutorId, setSelectedProsecutorId] = useState<string>()

  const calculateMargin = (count: number) => {
    if (count === 0) {
      return 40
    }

    const cappedCount = Math.min(count, 5)
    const baseMargin = 50
    const marginPerProsecutor = 65
    const margin = baseMargin + (cappedCount - 2) * marginPerProsecutor

    return Math.max(2, margin)
  }

  return (
    <Modal
      title="Breyta um sækjanda"
      text="Nýr sækjandi mun verða skráður sem sækjandi í málinu og fá tilkynningar er það varðar."
      onClose={onClose}
      primaryButton={{
        text: 'Staðfesta',
        onClick: async () => {
          await updateCase(caseId, {
            prosecutorId: selectedProsecutorId,
          })
          refreshCase()
          onClose()
        },
      }}
      secondaryButton={{
        text: 'Loka glugga',
        onClick: onClose,
      }}
    >
      <div
        style={{
          marginBottom: menuIsOpen ? calculateMargin(prosecutorsCount) : 40,
        }}
      >
        <ProsecutorSelection
          placeholder="Veldu sækjanda til að taka við málinu"
          isRequired={false}
          shouldInitializeSelector={true}
          onMenuOpen={() => setMenuIsOpen(true)}
          onMenuClose={() => setMenuIsOpen(false)}
          onProsecutorsLoaded={(count) => setProsecutorsCount(count)}
          onChange={(prosecutorId) => setSelectedProsecutorId(prosecutorId)}
        />
      </div>
    </Modal>
  )
}

export default ChangeProsecutorModal
