import { Dispatch, FC, SetStateAction, useCallback, useMemo } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { DateTime } from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  formatDateForServer,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  title: string
}

const ArrestDate: FC<Props> = ({ title, workingCase, setWorkingCase }) => {
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
