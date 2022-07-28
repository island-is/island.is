import React, { FC, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import get from 'lodash/get'
import format from 'date-fns/format'

import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
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
        <>
          <FieldDescription
            description={formatMessage(
              parentalLeaveFormMessages.selectChild.screenDescription,
            )}
          />

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
                          nationalId:
                            child.primaryParentNationalRegistryId ?? '',
                        },
                      )
                    : formatMessage(
                        parentalLeaveFormMessages.selectChild.primaryParent,
                      )

                return {
                  value: `${index}`,
                  dataTestId: `child-${index}`,
                  label: formatMessage(
                  parentalLeaveFormMessages.selectChild.baby,
                  { dateOfBirth: formatDateOfBirth(child.expectedDateOfBirth) ,
                    },
                  ),
                  subLabel,
                }
              })}
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

          <Stack space={2}>
            {existingApplications.map(
              ({ applicationId, expectedDateOfBirth }) => (
                <Box
                  border="standard"
                  borderRadius="large"
                  padding={4}
                  display="flex"
                  flexDirection="row"
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    width="full"
                    paddingLeft={[0, 2]}
                  >
                    <Box
                      display="flex"
                      flexDirection={['column', 'column', 'column', 'row']}
                      justifyContent="spaceBetween"
                      alignItems="flexStart"
                    >
                      <Text variant="h4" as="h2">
                        {formatMessage(
                          parentalLeaveFormMessages.selectChild.baby,
                          {
                            dateOfBirth: formatDateOfBirth(expectedDateOfBirth),
                          },
                        )}
                      </Text>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={['column', 'row']}
                      justifyContent={'spaceBetween'}
                      paddingTop={[1, 0]}
                    >
                      <Box>
                        <Text>{applicationId}</Text>
                      </Box>
                      <Box
                        paddingTop={[1, 0]}
                        onClick={() => selectExistingApplication(applicationId)}
                      >
                        <Box display="inlineBlock">
                          <Button size="small" colorScheme="default">
                            {formatMessage(
                              parentalLeaveFormMessages.selectChild.choose,
                            )}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ),
            )}
          </Stack>
        </>
      )}
    </Box>
  )
}

export default ChildSelector
