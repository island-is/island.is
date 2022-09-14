import React, { useContext } from 'react'

import { User } from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import ProsecutorSectionHeading from './ProsecutorSectionHeading'
import ProsecutorSelection from './ProsecutorSelection'
import { Box } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'

const ProsecutorSection: React.FC = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { setAndSendToServer } = useCase()

  const handleProsecutorChange = (prosecutor: User) => {
    setAndSendToServer(
      [
        {
          prosecutorId: prosecutor.id,
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )

    return true
  }

  return (
    <Box component="section" marginBottom={5}>
      <ProsecutorSectionHeading />
      <ProsecutorSelection onChange={handleProsecutorChange} />
    </Box>
  )
}

export default ProsecutorSection
