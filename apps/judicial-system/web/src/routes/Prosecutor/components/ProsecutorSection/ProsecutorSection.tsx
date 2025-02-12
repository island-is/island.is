import { FC, useContext } from 'react'

import { Box } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import {
  FormContext,
  ProsecutorSelection,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import ProsecutorSectionHeading from './ProsecutorSectionHeading'

interface Props {
  handleChange?: () => void
}

const ProsecutorSection: FC<Props> = (props) => {
  const { handleChange } = props
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateCase } = useCase()

  const setProsecutor = async (prosecutorId: string) => {
    if (workingCase) {
      const updatedCase = await updateCase(workingCase.id, {
        prosecutorId: prosecutorId,
      })

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
    <Box component="section" marginBottom={5}>
      <ProsecutorSectionHeading
        isIndictment={isIndictmentCase(workingCase.type)}
      />
      <ProsecutorSelection onChange={handleChange ?? handleProsecutorChange} />
    </Box>
  )
}

export default ProsecutorSection
