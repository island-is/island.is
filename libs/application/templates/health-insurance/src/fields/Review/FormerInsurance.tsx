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
            m.insuranceEntitlement,
            application,
            formatMessage,
          )}
        />
        <RadioController
          id={'insuranceRegistration'}
          disabled={false}
          name={'insuranceRegistration'}
          defaultValue={
            getValueViaPath(application.answers, 'children') as string[]
          }
          largeButtons={true}
          options={[
            {
              label: formatText(
                m.formerCountryOfInsuranceNoOption,
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
            m.formerCountryOfInsuranceInfo,
            application,
            formatMessage,
          )}
        />
        <GridRow>
          <GridColumn span="6/12">
            <Input
              id={'country'}
              name={'country'}
              label={formatText(m.country, application, formatMessage)}
              ref={register}
            />
          </GridColumn>
          <GridColumn span="6/12">
            <Input
              id={'id'}
              name={'id'}
              label={formatText(m.formerId, application, formatMessage)}
              ref={register}
            />
          </GridColumn>
        </GridRow>
        <Box paddingBottom={4}>
          <Input
            id={'insuranceInstitution'}
            name={'insuranceInstitution'}
            label={formatText(
              m.insuranceInstitution,
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
            m.insuranceEntitlement,
            application,
            formatMessage,
          )}
        />
        <RadioController
          id={'insuranceEntitlement'}
          name={'insuranceEntitlement'}
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
