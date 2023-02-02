import React, { FC, useCallback } from 'react'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { residentGrantIsOpenForApplication } from '../../lib/parentalLeaveUtils'
import DottetBackgroundImage from '../../assets/DottetBackgroundImage'
import WomanWithLaptopIllustration from '../../assets/Images/WomanWithLaptopIllustration'
import { FieldDescription } from '@island.is/shared/form-fields'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { States } from '../../constants'

const ResidentGrantApplication: FC<FieldBaseProps> = ({
  application,
  refetch,
  field,
}) => {
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => e,
    },
  )

  type eventType = {
    [key: string]: any
  }

  type KeyValue = {
    [key: string]: any[]
  }

  const eventsMap: eventType = {
    closed: 'CLOSED',
    approved: 'APPROVED',
    employerApproval: 'EMPLOYERAPPROVAL',
    employerWaitingToAssign: 'EMPLOYERWAITINGTOASSIGN',
    vinnumalastofnunApproval: 'VINNUMALASTOFNUNAPPROVAL',
    additionalDocumentRequired: 'ADDITIONALDOCUMENTREQUIRED',
  }

  const descriptionMap: KeyValue = {
    rights: [
      'residenceGrantRights',
      'residenceGrantRightsRequirments',
      'residenceGrantError',
    ],
    apply: [
      'residenceGrantApplication',
      'residenceGrantApplicationInfo',
      'residenceGrantError',
    ],
    payment: [
      'residenceGrantPayment',
      'residenceGrantPaymentAmount',
      'residenceGrantPaymentCorrection',
    ],
    submit: [
      'residenceGrantOpen',
      'residenceGrantNotOpen',
      'residenceGrantError',
    ],
    nothing: [
      'residenceGrantError',
      'residenceGrantError',
      'residenceGrantError',
    ],
  }
  const { formatMessage } = useLocale()

  const defaultValue =
    field.defaultValue === 'rights' ||
    field.defaultValue === 'apply' ||
    field.defaultValue === 'payment' ||
    field.defaultValue === 'submit'
      ? field.defaultValue
      : 'nothing'

  const displayButtons = defaultValue === 'submit'

  const { previousState, ...rest } = application.answers
  const { dateOfBirth } = application.answers
  const canApplyForResidenceGrant =
    (dateOfBirth && residentGrantIsOpenForApplication(`${dateOfBirth}`)) ||
    false

  const handleSubmitApplication = useCallback(async (event?: string) => {
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event:
            event === 'APPROVE'
              ? 'APPROVE'
              : `${eventsMap[`${previousState}`]}${event || ''}`,
          answers: rest,
        },
      },
    })
    if (res?.data) {
      // Takes them to the next state (which loads the relevant form)
      refetch?.()
    }
  }, [])

  const primaryDescription =
    parentalLeaveFormMessages.residenceGrantMessage[
      descriptionMap[defaultValue][0]
    ]
  const secondaryDescription =
    parentalLeaveFormMessages.residenceGrantMessage[
      descriptionMap[defaultValue][1]
    ]
  const tertiaryDescription =
    parentalLeaveFormMessages.residenceGrantMessage[
      descriptionMap[defaultValue][2]
    ]
  const submitDescription =
    parentalLeaveFormMessages.residenceGrantMessage[
      descriptionMap[defaultValue][canApplyForResidenceGrant ? 0 : 1]
    ]

  return application.state ===
    States.RESIDENCE_GRAND_APPLICATION_IN_PROGRESS ? (
    <Box>
      <Box>
        <Box>
          <Button variant="ghost" onClick={() => handleSubmitApplication()}>
            {
              parentalLeaveFormMessages.residenceGrantMessage[
                'residenceGrantSubmit'
              ].defaultMessage
            }
          </Button>
        </Box>
      </Box>
    </Box>
  ) : (
    <Box>
      {!displayButtons && (
        <Box>
          <Box marginTop={2} marginBottom={2}>
            <FieldDescription description={formatMessage(primaryDescription)} />
          </Box>
          <Divider />
          <Box marginTop={4} marginBottom={2}>
            <FieldDescription
              description={formatMessage(secondaryDescription)}
            />
          </Box>
          {defaultValue === 'payment' && (
            <Box>
              <Divider />
              <Box marginTop={4}>
                <FieldDescription
                  description={formatMessage(tertiaryDescription)}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
      {displayButtons && (
        <Box>
          <Text variant="h2">
            {
              parentalLeaveFormMessages.residenceGrantMessage[
                canApplyForResidenceGrant
                  ? 'residenceGrantOpenTitle'
                  : 'residenceGrantNotOpenTitle'
              ].defaultMessage
            }
          </Text>
          <FieldDescription description={formatMessage(submitDescription)} />
          <Box>
            <Box marginTop={5} display={'flex'} justifyContent={'spaceAround'}>
              <Box>
                <Button
                  variant="ghost"
                  colorScheme="destructive"
                  onClick={() => handleSubmitApplication('REJECT')}
                >
                  {
                    parentalLeaveFormMessages.residenceGrantMessage[
                      'residenceGrantReject'
                    ].defaultMessage
                  }
                </Button>
              </Box>
              <Box>
                <Button
                  variant="ghost"
                  onClick={() => handleSubmitApplication('APPROVE')}
                >
                  {
                    parentalLeaveFormMessages.residenceGrantMessage[
                      'residenceGrantSubmit'
                    ].defaultMessage
                  }
                </Button>
              </Box>
            </Box>

            <Box>
              <DottetBackgroundImage
                field={field}
                application={application}
                alignItems={'center'}
              >
                <WomanWithLaptopIllustration />
              </DottetBackgroundImage>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default ResidentGrantApplication
