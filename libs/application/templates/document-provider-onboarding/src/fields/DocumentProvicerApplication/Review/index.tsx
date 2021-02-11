import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, GridColumn, GridRow, Input } from '@island.is/island-ui/core'
import {
  FieldDescription,
  InputController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import { m } from '../../../forms/messages'

const Review: FC<FieldBaseProps> = ({ field, application }) => {
  const { description } = field
  const { formatMessage } = useLocale()
  const { clearErrors, errors } = useFormContext()

  const getValue = (id: string) => {
    return getValueViaPath(application.answers, id) as string
  }

  return (
    <div>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}
      {/* helpdeskContact Workaround */}
      <Box paddingTop={2}>
        <GridRow>
          <GridColumn span="1/1">
            <InputController
              id="helpDesk.email"
              placeholder={formatText(
                m.helpDeskEmailPlaceholder,
                application,
                formatMessage,
              )}
              label={formatText(m.helpDeskEmail, application, formatMessage)}
              error={errors.helpDesk?.email}
              type={'email'}
              onChange={() => {
                if (errors.helpDesk?.email) {
                  clearErrors('helpDesk.email')
                }
              }}
              defaultValue={getValue('helpDesk.email')}
            />
          </GridColumn>
          <GridColumn span="1/1" paddingTop={3}>
            <InputController
              id="helpDesk.phoneNumber"
              placeholder={formatText(
                m.helpDeskPhoneNumberPlaceholder,
                application,
                formatMessage,
              )}
              label={formatText(
                m.helpDeskPhoneNumber,
                application,
                formatMessage,
              )}
              error={errors.helpDesk?.phoneNumber}
              onChange={() => {
                if (errors.helpDesk?.phoneNumber) {
                  clearErrors('helpDesk.phoneNumber')
                }
              }}
              type={'tel'}
              format="###-####"
              defaultValue={getValue('helpDesk.phoneNumber')}
            />
          </GridColumn>
        </GridRow>
      </Box>
    </div>
  )
}

export default Review
