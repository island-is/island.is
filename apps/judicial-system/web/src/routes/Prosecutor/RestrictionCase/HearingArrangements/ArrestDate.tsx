import React, { useCallback, useMemo } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { DateTime } from '@island.is/judicial-system-web/src/components'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  title: string
}

const ArrestDate: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { title, workingCase, setWorkingCase } = props
  const { setAndSendCaseToServer } = useCase()

  const onChange = useCallback(
    (date: Date | undefined, valid: boolean) => {
      if (date && valid) {
        setAndSendCaseToServer(
          [
            {
              arrestDate: formatDateForServer(date),
              force: true,
            },
          ],
          workingCase,
          setWorkingCase,
        )
      }
    },
    [setAndSendCaseToServer, workingCase, setWorkingCase],
  )

  const caseType = workingCase.type
  const isArrestTimeRequired = useMemo(
    () =>
      caseType === CaseType.CUSTODY ||
      caseType === CaseType.ADMISSION_TO_FACILITY,
    [caseType],
  )

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
