import { FC, useContext } from 'react'

import { isIndictmentCase } from '@island.is/judicial-system/types'
import {
  FormContext,
  ProsecutorSelection,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import ProsecutorSectionHeading from './ProsecutorSectionHeading'

const ProsecutorSection: FC = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateCase } = useCase()

  const setProsecutor = async (prosecutorId: string) => {
    if (workingCase) {
      const updatedCase = await updateCase(workingCase.id, {
        prosecutorId: prosecutorId,
      })

      if (!updatedCase) {
        return
      }

      const prosecutor = updatedCase?.prosecutor

      setWorkingCase((prevWorkingCase) => ({
        ...prevWorkingCase,
        prosecutor,
      }))
    }
  }

  const handleProsecutorChange = (prosecutorId: string) => {
    setProsecutor(prosecutorId)
  }

  return (
    <>
      <ProsecutorSectionHeading
        isIndictment={isIndictmentCase(workingCase.type)}
      />
      <ProsecutorSelection onChange={handleProsecutorChange} />
    </>
  )
}

export default ProsecutorSection
