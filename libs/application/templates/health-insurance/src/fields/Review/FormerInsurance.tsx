import React, { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  GridColumn,
  GridRow,
  Input,
  Stack,
  Box,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import TextWithTooltip from '../TextWithTooltip/TextWithTooltip'
import { YES, NO } from '../../constants'

import { m } from '../../forms/messages'
import { ReviewFieldProps } from '../../types'

const FormerInsurance: FC<ReviewFieldProps> = ({
  application,
  isEditable,
  field,
}) => {
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

  const [entitlement, setEntitlement] = useState(
    getValueViaPath(
      application.answers,
      'formerInsurance.entitlement',
    ) as string,
  )

  return (
    <Box>
      <Stack space={2}>
        <Text paddingBottom={1}>
          {formatText(
            m.formerInsuranceRegistration,
            application,
            formatMessage,
          )}
        </Text>
        <RadioController
          id={'formerInsurance.registration'}
          name={'formerInsurance.registration'}
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
              id={'formerInsurance.country'}
              name={'formerInsurance.country'}
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
              id={'formerInsurance.personalId'}
              name={'formerInsurance.personalId'}
              label={formatText(m.formerPersonalId, application, formatMessage)}
              ref={register}
              disabled={!isEditable}
            />
          </GridColumn>
        </GridRow>
        <Box paddingBottom={4}>
          <Input
            id={'formerInsurance.institution'}
            name={'formerInsurance.institution'}
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
      <Box paddingBottom={4}>
        <TextWithTooltip
          application={application}
          field={field}
          title={formatText(
            m.formerInsuranceEntitlement,
            application,
            formatMessage,
          )}
          description={formatText(
            m.formerInsuranceEntitlementTooltip,
            application,
            formatMessage,
          )}
        />
      </Box>
      <RadioController
        id={'formerInsurance.entitlement'}
        name={'formerInsurance.entitlement'}
        onSelect={(value) => setEntitlement(value as string)}
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
      {entitlement === YES && (
        <Box marginBottom={[2, 2, 4]}>
          <Input
            id={'formerInsurance.additionalInformation'}
            name={'formerInsurance.additionalInformation'}
            label={formatText(
              m.formerInsuranceAdditionalInformation,
              application,
              formatMessage,
            )}
            placeholder={formatText(
              m.formerInsuranceAdditionalInformationPlaceholder,
              application,
              formatMessage,
            )}
            ref={register}
            disabled={!isEditable}
            textarea={true}
          />
        </Box>
      )}
    </Box>
  )
}

export default FormerInsurance
