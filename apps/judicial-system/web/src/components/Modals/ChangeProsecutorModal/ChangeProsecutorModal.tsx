import React, { FC, useContext, useState } from 'react'

import { isRequestCase } from '@island.is/judicial-system/types'
import {
  FormContext,
  Modal,
  ProsecutorSelection,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  onClose: () => void
}

const ChangeProsecutorModal: FC<Props> = (props) => {
  const { onClose } = props
  const { updateCase } = useCase()
  const { refreshCase, workingCase } = useContext(FormContext)

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false)
  const [prosecutorsCount, setProsecutorsCount] = useState<number>(0)
  const [selectedProsecutorId, setSelectedProsecutorId] = useState<string>()
  const title = isRequestCase(workingCase.type)
    ? 'Breyta um sækjanda'
    : 'Breyta um ákæranda'
  const text = isRequestCase(workingCase.type)
    ? 'Nýr sækjandi mun verða skráður sem sækjandi í málinu og fá tilkynningar er það varðar.'
    : 'Nýr ákærandi mun verða skráður sem ákærandi í málinu og fá tilkynningar er það varðar.'
  const placeholder = isRequestCase(workingCase.type)
    ? 'Veldu sækjanda til að taka við málinu'
    : 'Veldu ákæranda til að taka við málinu'

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
      title={title}
      text={text}
      onClose={onClose}
      primaryButton={{
        text: 'Staðfesta',
        isDisabled: !selectedProsecutorId,
        onClick: async () => {
          if (!selectedProsecutorId) {
            return
          }
          await updateCase(workingCase.id, {
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
          placeholder={placeholder}
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
