import {
  Label,
  ReviewGroup,
  DataValue,
} from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { EmployersTable } from '../../components/EmployersTable'
import { getApplicationAnswers } from '../../../lib/oldAgePensionUtils'
import { Employment } from '../../../lib/constants'

export const Employers = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { employers, employmentStatus } = getApplicationAnswers(
    application.answers,
  )
  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('employment.status')}
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '7/12']}>
          <DataValue
            label={formatMessage(
              oldAgePensionFormMessage.employer.selfEmployedOrEmployeeTitle,
            )}
            value={formatMessage(
              employmentStatus === Employment.EMPLOYEE
                ? oldAgePensionFormMessage.employer.employee
                : oldAgePensionFormMessage.employer.selfEmployed,
            )}
          />
        </GridColumn>
      </GridRow>
      {employmentStatus === Employment.EMPLOYEE && (
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '12/12']}
            paddingTop={3}
          >
            <Label>
              {formatMessage(oldAgePensionFormMessage.employer.employerTitle)}
            </Label>
            {employers?.length > 0 && (
              <Box paddingTop={2}>
                <EmployersTable employers={employers} />
              </Box>
            )}
          </GridColumn>
        </GridRow>
      )}
    </ReviewGroup>
  )
}
