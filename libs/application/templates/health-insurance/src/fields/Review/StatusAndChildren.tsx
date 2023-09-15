import React, { FC, useState } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { YES, NO, FILE_SIZE_LIMIT, StatusTypes } from '../../shared'
import { ReviewFieldProps, Status } from '../../types'
import ChildrenInfoMessage from '../ChildrenInfoMessage/ChildrenInfoMessage'
import TextWithTooltip from '../TextWithTooltip/TextWithTooltip'

import { m } from '../../forms/messages'
import { FileUploadController } from '@island.is/application/ui-components'

const StatusAndChildren: FC<React.PropsWithChildren<ReviewFieldProps>> = ({
  application,
  isEditable,
  field,
}) => {
  const { formatMessage } = useLocale()

  const [status, setStatus] = useState(
    getValueViaPath(application.answers, 'status') as Status,
  )

  const [children, setChildren] = useState(
    getValueViaPath(application.answers, 'children') as string,
  )

  return (
    <Box>
      <Stack space={2}>
        <Stack space={2}>
          <Text marginBottom={1}>
            {formatText(m.statusDescription, application, formatMessage)}
          </Text>
          <RadioController
            id="status.type"
            name="status.type"
            disabled={!isEditable}
            largeButtons={true}
            split={'1/2'}
            onSelect={(value) =>
              setStatus({ ...status, type: value as StatusTypes })
            }
            options={[
              {
                label: formatText(m.statusEmployed, application, formatMessage),
                value: StatusTypes.EMPLOYED,
                tooltip: formatText(
                  m.statusEmployedInformation,
                  application,
                  formatMessage,
                ),
              },
              {
                label: formatText(m.statusStudent, application, formatMessage),
                value: StatusTypes.STUDENT,
                tooltip: formatText(
                  m.statusStudentInformation,
                  application,
                  formatMessage,
                ),
              },
              {
                label: formatText(
                  m.statusPensioner,
                  application,
                  formatMessage,
                ),
                value: StatusTypes.PENSIONER,
                tooltip: formatText(
                  m.statusPensionerInformation,
                  application,
                  formatMessage,
                ),
              },
              {
                label: formatText(m.statusOther, application, formatMessage),
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
        {status.type === StatusTypes.STUDENT && (
          <Box marginBottom={2}>
            <Stack space={4}>
              <TextWithTooltip
                field={field}
                application={application}
                title={formatText(
                  m.confirmationOfStudies,
                  application,
                  formatMessage,
                )}
                description={formatText(
                  m.confirmationOfStudiesTooltip,
                  application,
                  formatMessage,
                )}
              />
              <FileUploadController
                application={application}
                id="status.confirmationOfStudies"
                maxSize={FILE_SIZE_LIMIT}
                header={formatText(
                  m.fileUploadHeader,
                  application,
                  formatMessage,
                )}
                description={formatText(
                  m.fileUploadDescription,
                  application,
                  formatMessage,
                )}
                buttonLabel={formatText(
                  m.fileUploadButton,
                  application,
                  formatMessage,
                )}
              />
            </Stack>
          </Box>
        )}
        <Stack space={1}>
          <Stack space={2}>
            <FieldDescription
              description={formatText(
                m.childrenDescription,
                application,
                formatMessage,
              )}
            />
            <RadioController
              id="children"
              name="children"
              disabled={!isEditable}
              defaultValue={
                getValueViaPath(application.answers, 'children') as string[]
              }
              onSelect={(value) => setChildren(value as string)}
              largeButtons={true}
              split={'1/2'}
              options={[
                {
                  label: formatText(
                    m.noOptionLabel,
                    application,
                    formatMessage,
                  ),
                  value: NO,
                },
                {
                  label: formatText(
                    m.yesOptionLabel,
                    application,
                    formatMessage,
                  ),
                  value: YES,
                },
              ]}
            />
          </Stack>
          {children === YES && (
            <Box marginBottom={[2, 2, 4]}>
              <ChildrenInfoMessage application={application} field={field} />
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}

export default StatusAndChildren
