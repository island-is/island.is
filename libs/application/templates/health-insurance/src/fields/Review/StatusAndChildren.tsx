import React, { FC, useState } from 'react'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, InputFileUpload, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { YES, NO } from '../../constants'
import { StatusTypes } from '../../types'

import { m } from '../../forms/messages'

const StatusAndChildren: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const [status, setStatus] = useState(
    getValueViaPath(application.answers, 'status') as StatusTypes,
  )

  return (
    <Stack space={2}>
      <Stack space={2}>
        <FieldDescription
          description={formatText(
            m.statusDescription,
            application,
            formatMessage,
          )}
        />
        <RadioController
          id={'status'}
          disabled={false}
          name={'status'}
          largeButtons={true}
          split={'1/2'}
          onSelect={(value) => setStatus(value as StatusTypes)}
          options={[
            {
              label: formatText(m.statusPensioner, application, formatMessage),
              value: StatusTypes.PENSIONER,
              tooltip: formatText(
                m.statusPensionerInformation,
                application,
                formatMessage,
              ),
            },
            {
              label: m.statusStudent.defaultMessage,
              value: StatusTypes.STUDENT,
              tooltip: formatText(
                m.statusStudentInformation,
                application,
                formatMessage,
              ),
            },
            {
              label: m.statusOther.defaultMessage,
              value: StatusTypes.OTHER,
              tooltip: formatText(
                m.statusOtherInformation,
                application,
                formatMessage,
              ),
            },
          ]}
        />
      </Stack>
      {status === StatusTypes.STUDENT && (
        <Box paddingBottom={2}>
          <Stack space={2}>
            <FieldDescription
              description={formatText(
                m.statusAdditionalInformation,
                application,
                formatMessage,
              )}
            />
            <InputFileUpload fileList={[{ name: '' }]} onRemove={() => {}} />
          </Stack>
        </Box>
      )}
      <Stack space={2}>
        <FieldDescription
          description={formatText(
            m.childrenDescription,
            application,
            formatMessage,
          )}
        />
        <RadioController
          id={'children'}
          disabled={false}
          name={'children'}
          defaultValue={
            getValueViaPath(application.answers, 'children') as string[]
          }
          largeButtons={true}
          split={'1/2'}
          options={[
            {
              label: formatText(m.yesOptionLabel, application, formatMessage),
              value: YES,
            },
            {
              label: formatText(m.noOptionLabel, application, formatMessage),
              value: NO,
            },
          ]}
        />
      </Stack>
    </Stack>
  )
}

export default StatusAndChildren
