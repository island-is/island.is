import React, { FC } from 'react'

import { Application } from '@island.is/application/types'
import { Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { ReviewGroup, Label } from '@island.is/application/ui-components'
import { EmployersTable } from '../components/EmployersTable'
import { useStatefulAnswers } from '../../hooks/useStatefulAnswers'
import { YES } from '../../constants'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const Employers: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const [{ addEmployer, employers, tempEmployers }] =
    useStatefulAnswers(application)

  const employersArray = addEmployer === YES ? employers : tempEmployers

  return (
    <ReviewGroup isEditable editAction={() => goToScreen?.('addEmployer')}>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Label>
            {formatMessage(parentalLeaveFormMessages.employer.title)}
          </Label>
          {employersArray?.length > 0 && (
            <Box paddingTop={3}>
              <EmployersTable employers={employersArray} />
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}

export default Employers
