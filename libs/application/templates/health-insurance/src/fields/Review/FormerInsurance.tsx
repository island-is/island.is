import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
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

const FormerInsurance: FC<FieldBaseProps> = ({ application }) => {
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
          disabled={false}
          name={'formerInsuranceRegistration'}
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
            />
          </GridColumn>
          <GridColumn span="6/12">
            <Input
              id={'formerPersonalId'}
              name={'formerPersonalId'}
              label={formatText(m.formerPersonalId, application, formatMessage)}
              ref={register}
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
