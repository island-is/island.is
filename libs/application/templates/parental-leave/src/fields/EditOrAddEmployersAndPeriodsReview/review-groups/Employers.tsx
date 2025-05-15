import {
  Application,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import {
  Label,
  ReviewGroup,
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { StaticTableFormField } from '@island.is/application/ui-fields'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import {
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
} from '../../../constants'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import { getApplicationAnswers } from '../../../lib/parentalLeaveUtils'
import { YES } from '@island.is/application/core'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const Employers: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()

  const {
    employers,
    addEmployer,
    tempEmployers,
    applicationType,
    isReceivingUnemploymentBenefits,
    isSelfEmployed,
    employerLastSixMonths,
  } = getApplicationAnswers(application.answers)

  const employersArray = addEmployer === YES ? employers : tempEmployers

  const hasEmployer =
    (applicationType === PARENTAL_LEAVE &&
      isReceivingUnemploymentBenefits !== YES &&
      isSelfEmployed !== YES) ||
    ((applicationType === PARENTAL_GRANT ||
      applicationType === PARENTAL_GRANT_STUDENTS) &&
      employerLastSixMonths === YES)

  const rows = employersArray.map((e) => {
    return [
      e.email,
      formatPhoneNumber(removeCountryCode(e.phoneNumber ?? '')),
      `${e.ratio}%`,
    ]
  })

  return (
    hasEmployer &&
    employers.length !== 0 && (
      <ReviewGroup isEditable editAction={() => goToScreen?.('addEmployer')}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
            <Label>
              {formatMessage(parentalLeaveFormMessages.employer.title)}
            </Label>
            {employersArray?.length > 0 && (
              <Box paddingTop={3}>
                <StaticTableFormField
                  application={application}
                  field={{
                    type: FieldTypes.STATIC_TABLE,
                    component: FieldComponents.STATIC_TABLE,
                    children: undefined,
                    id: 'employersTable',
                    title: '',
                    header: [
                      parentalLeaveFormMessages.employer.emailHeader,
                      parentalLeaveFormMessages.employer.phoneNumberHeader,
                      parentalLeaveFormMessages.employer.ratioHeader,
                    ],
                    rows,
                  }}
                />
              </Box>
            )}
          </GridColumn>
        </GridRow>
      </ReviewGroup>
    )
  )
}

export default Employers
