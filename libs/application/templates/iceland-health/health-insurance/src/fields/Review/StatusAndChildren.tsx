import { useState } from 'react'
import {
  formatText,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { ReviewFieldProps, Status } from '../../utils/types'
import { TextWithTooltip } from '../TextWithTooltip/TextWithTooltip'
import { m } from '../../lib/messages/messages'
import { FileUploadController } from '@island.is/application/ui-components'
import { FILE_SIZE_LIMIT, EmploymentStatus } from '../../utils/constants'

export const StatusAndChildren = ({
  application,
  isEditable,
  field,
}: ReviewFieldProps) => {
  const { formatMessage } = useLocale()

  const [status, setStatus] = useState(
    getValueViaPath<Status>(application.answers, 'status'),
  )

  // const [children, setChildren] = useState(
  //   getValueViaPath<string>(application.answers, 'children') ?? '',
  // )

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
            onSelect={(value) => {
              setStatus({
                confirmationOfStudies: status?.confirmationOfStudies ?? [],
                type: value as EmploymentStatus,
              })
            }}
            options={[
              {
                label: formatText(m.statusEmployed, application, formatMessage),
                value: EmploymentStatus.EMPLOYED,
                tooltip: formatText(
                  m.statusEmployedInformation,
                  application,
                  formatMessage,
                ),
              },
              {
                label: formatText(m.statusStudent, application, formatMessage),
                value: EmploymentStatus.STUDENT,
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
                value: EmploymentStatus.PENSIONER,
                tooltip: formatText(
                  m.statusPensionerInformation,
                  application,
                  formatMessage,
                ),
              },
              {
                label: formatText(m.statusOther, application, formatMessage),
                value: EmploymentStatus.OTHER,
                tooltip: formatText(
                  m.statusOtherInformation,
                  application,
                  formatMessage,
                ),
              },
            ]}
          />
        </Stack>
        {status?.type === EmploymentStatus.STUDENT && (
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
              defaultValue={getValueViaPath<Array<string>>(
                application.answers,
                'children',
              )}
              // onSelect={(value) => setChildren(value)}
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
          {/*
          TODO: Refactor the whole review section when build accordion field merges and add this back in
          {children === YES && (
            <Box marginBottom={[2, 2, 4]}>
              <ChildrenInfoMessage application={application} field={field} />
            </Box>
          )} */}
        </Stack>
      </Stack>
    </Box>
  )
}
