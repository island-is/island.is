import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, GridColumn, GridRow, Input } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import { m } from '../../../forms/messages'

const Review: FC<FieldBaseProps> = ({ field, application }) => {
  const { description } = field
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

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
            <Input
              id="helpDesk.email"
              name="helpDesk.email"
              label={formatText(m.helpDeskEmail, application, formatMessage)}
              defaultValue={getValue('helpDesk.email')}
              placeholder={formatText(
                m.helpDeskEmailPlaceholder,
                application,
                formatMessage,
              )}
              ref={register}
            />
          </GridColumn>
          <GridColumn span="1/1" paddingTop={3}>
            <Input
              id="helpDesk.phoneNumber"
              name="helpDesk.phoneNumber"
              label={formatText(
                m.helpDeskPhoneNumber,
                application,
                formatMessage,
              )}
              defaultValue={getValue('helpDesk.phoneNumber')}
              placeholder={formatText(
                m.helpDeskPhoneNumberPlaceholder,
                application,
                formatMessage,
              )}
              ref={register}
            />
          </GridColumn>
        </GridRow>
      </Box>
    </div>
  )
}

export default Review
