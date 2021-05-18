import React, { FC, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import get from 'lodash/get'
import {
  ApplicationConfigurations,
  FieldBaseProps,
  getValueViaPath,
} from '@island.is/application/core'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'

const ChildSelector: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()
  const history = useHistory()

  const { children, existingApplications } = get(
    application,
    'externalData.children.data',
    [],
  ) as {
    children: { expectedDateOfBirth: string }[]
    existingApplications: {
      applicationId: string
      expectedDateOfBirth: string
    }[]
  }

  useEffect(() => {
    if (setBeforeSubmitCallback) {
      setBeforeSubmitCallback(async () => {
        if (children.length === 0) {
          // Application should not be able to move forward if there are no children
          return [false, '']
        }
        return [true, null]
      })
    }
  })

  const selectExistingApplication = (id: string) => {
    history.push(`/${ApplicationConfigurations.ParentalLeave.slug}/${id}`)
  }

  return (
    <Box>
      {children.length > 0 && (
        <>
          <FieldDescription
            description={formatMessage(
              parentalLeaveFormMessages.selectChild.title,
            )}
          />

          <Box marginY={3}>
            <RadioController
              id="selectedChild"
              disabled={false}
              name="selectedChild"
              largeButtons={true}
              defaultValue={
                getValueViaPath(
                  application.answers,
                  'selectedChild',
                ) as string[]
              }
              options={children.map((child, index) => ({
                value: `${index}`,
                label: child.expectedDateOfBirth,
              }))}
            />
          </Box>
        </>
      )}

      {existingApplications.length > 0 && (
        <>
          <FieldDescription
            description={formatMessage(
              parentalLeaveFormMessages.selectChild.activeApplications,
            )}
          />

          <Box marginY={3}>
            {existingApplications.map(
              ({ applicationId, expectedDateOfBirth }) => (
                <Button
                  key={applicationId}
                  onClick={() => selectExistingApplication(applicationId)}
                  icon="arrowForward"
                  variant="primary"
                  colorScheme="light"
                  size="small"
                >
                  {expectedDateOfBirth}
                </Button>
              ),
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default ChildSelector
