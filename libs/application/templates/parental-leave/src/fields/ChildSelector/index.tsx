import React, { FC, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import get from 'lodash/get'
import format from 'date-fns/format'

import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/core'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { dateFormat } from '@island.is/shared/constants'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { useApplicationAnswers } from '../../hooks/useApplicationAnswers'
import { ParentalRelations } from '../../constants'

const ChildSelector: FC<FieldBaseProps> = ({
  application,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()
  const history = useHistory()
  const { selectedChild } = useApplicationAnswers(application)

  const { children, existingApplications } = get(
    application,
    'externalData.children.data',
    [],
  ) as {
    children: {
      expectedDateOfBirth: string
      primaryParentNationalRegistryId?: string
      parentalRelation: ParentalRelations
    }[]
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

  const formatDateOfBirth = (value: string) =>
    format(new Date(value), dateFormat.is)

  return (
    <Box>
      {children.length > 0 && (
        <Box marginY={3}>
          <RadioController
            id="selectedChild"
            disabled={false}
            name="selectedChild"
            largeButtons={true}
            defaultValue={selectedChild}
            options={children.map((child, index) => {
              const subLabel =
                child.parentalRelation === ParentalRelations.secondary
                  ? formatMessage(
                      parentalLeaveFormMessages.selectChild.secondaryParent,
                      {
                        nationalId: child.primaryParentNationalRegistryId ?? '',
                      },
                    )
                  : formatMessage(
                      parentalLeaveFormMessages.selectChild.primaryParent,
                    )

              return {
                value: `${index}`,
                label: formatMessage(
                  parentalLeaveFormMessages.selectChild.baby,
                  { dateOfBirth: formatDateOfBirth(child.expectedDateOfBirth) },
                ),
                subLabel,
              }
            })}
          />
        </Box>
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
                  {formatMessage(parentalLeaveFormMessages.selectChild.baby, {
                    dateOfBirth: formatDateOfBirth(expectedDateOfBirth),
                  })}
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
