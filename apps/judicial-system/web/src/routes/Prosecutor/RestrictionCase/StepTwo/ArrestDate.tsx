import React, { useMemo, useCallback } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { CaseType, Case } from '@island.is/judicial-system/types'
import { setAndSendDateToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import { DateTime } from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  title: string
}

const ArrestDate: React.FC<Props> = (props) => {
  const { title, workingCase, setWorkingCase } = props
  const { updateCase } = useCase()

  const onChange = useCallback(
    (date: Date | undefined, valid: boolean) => {
      setAndSendDateToServer(
        'arrestDate',
        date,
        valid,
        workingCase,
        setWorkingCase,
        updateCase,
      )
    },
    [workingCase, setWorkingCase, updateCase],
  )

  const caseType = workingCase.type
  const isArrestTimeRequired = useMemo(() => caseType === CaseType.CUSTODY, [
    caseType,
  ])

  return (
    <Box component="section" marginBottom={5}>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          {title}
        </Text>
      </Box>
      <DateTime
        name="arrestDate"
        maxDate={new Date()}
        selectedDate={workingCase.arrestDate}
        required={isArrestTimeRequired}
        onChange={onChange}
      />
    </Box>
  )
}

export default ArrestDate
