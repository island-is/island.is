import type { Dispatch, FC, SetStateAction } from 'react'
import { useCallback, useMemo } from 'react'

import { Box } from '@island.is/island-ui/core'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  DateTime,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  formatDateForServer,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  workingCase: WorkingCase
  setWorkingCase: Dispatch<SetStateAction<WorkingCase>>
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
    <Box component="section">
      <SectionHeading title={title} />
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
