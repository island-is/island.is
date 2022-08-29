import React, { useContext } from 'react'

import { User } from '@island.is/judicial-system/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import ProsecutorSectionHeading from './ProsecutorSectionHeading'
import ProsecutorSelection from './ProsecutorSelection'

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
    <>
      <ProsecutorSectionHeading />
      <ProsecutorSelection onChange={handleProsecutorChange} />
    </>
  )
}

export default ProsecutorSection
