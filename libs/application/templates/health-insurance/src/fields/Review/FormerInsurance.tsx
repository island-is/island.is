import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { formatText } from '@island.is/application/core'
import {
  GridColumn,
  GridRow,
  Input,
  Stack,
  Box,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { YES, NO } from '../../constants'

import { m } from '../../forms/messages'
import { ReviewFieldProps } from '../../types'

const FormerInsurance: FC<ReviewFieldProps> = ({ application, isEditable }) => {
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Stack space={2}>
        <FieldDescription
          description={formatText(
            m.formerInsuranceRegistration,
            application,
            formatMessage,
          )}
        />
        <RadioController
          id={'formerInsuranceRegistration'}
          name={'formerInsuranceRegistration'}
          disabled={!isEditable}
          largeButtons={true}
          options={[
            {
              label: formatText(
                m.formerInsuranceNoOption,
                application,
                formatMessage,
              ),
              value: NO,
            },
            {
              label: formatText(m.yesOptionLabel, application, formatMessage),
              value: YES,
            },
          ]}
        />
      </Stack>
      <Stack space={2}>
        <FieldDescription
          description={formatText(
            m.formerInsuranceDetails,
            application,
            formatMessage,
          )}
        />
        <GridRow>
          <GridColumn span="6/12">
            <Input
              id={'formerInsuranceCountry'}
              name={'formerInsuranceCountry'}
              label={formatText(
                m.formerInsuranceCountry,
                application,
                formatMessage,
              )}
              ref={register}
              disabled={!isEditable}
            />
          </GridColumn>
          <GridColumn span="6/12">
            <Input
              id={'formerPersonalId'}
              name={'formerPersonalId'}
              label={formatText(m.formerPersonalId, application, formatMessage)}
              ref={register}
              disabled={!isEditable}
            />
          </GridColumn>
        </GridRow>
        <Box paddingBottom={4}>
          <Input
            id={'formerInsuranceInstitution'}
            name={'formerInsuranceInstitution'}
            label={formatText(
              m.formerInsuranceInstitution,
              application,
              formatMessage,
            )}
            ref={register}
            disabled={!isEditable}
          />
        </Box>
      </Stack>

      <Stack space={2}>
        <FieldDescription
          description={formatText(
            m.formerInsuranceEntitlement,
            application,
            formatMessage,
          )}
        />
        <RadioController
          id={'formerInsuranceEntitlement'}
          name={'formerInsuranceEntitlement'}
          disabled={!isEditable}
          largeButtons={true}
          split={'1/2'}
          options={[
            {
              label: formatText(m.noOptionLabel, application, formatMessage),
              value: NO,
            },
            {
              label: formatText(m.yesOptionLabel, application, formatMessage),
              value: YES,
            },
          ]}
        />
      </Stack>
    </Box>
  )
}

export default FormerInsurance
