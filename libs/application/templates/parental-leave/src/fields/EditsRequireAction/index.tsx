import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'

import {
  FieldBaseProps,
  getValueViaPath,
  MessageFormatter,
} from '@island.is/application/core'
import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'

import { parentalLeaveFormMessages } from '../../lib/messages'

import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'

function handleError(error: string, formatMessage: MessageFormatter): void {
  toast.error(
    formatMessage(
      {
        id: 'application.system:submit.error',
        defaultMessage: 'Eitthvað fór úrskeiðis: {error}',
        description: 'Error message on submit',
      },
      { error },
    ),
  )
}

import { States as ApplicationStates } from '../../lib/ParentalLeaveTemplate'

const EditsRequireAction: FC<FieldBaseProps> = ({ application, refetch }) => {
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleError(e.message, formatMessage),
    },
  )

  const { formatMessage } = useLocale()

  const descKey =
    application.state === ApplicationStates.EMPLOYER_EDITS_ACTION
      ? parentalLeaveFormMessages.editFlow.editsNotApprovedEmployerDesc
      : parentalLeaveFormMessages.editFlow.editsNotApprovedVMLSTDesc

  return (
    <Box>
      <Box>
        <FieldDescription description={formatMessage(descKey)} />
      </Box>
      <Box marginTop={10}>
        <Text variant="h3" marginTop={4}>
          {formatMessage(
            parentalLeaveFormMessages.editFlow.editsNotApprovedCTA,
          )}
        </Text>
        <Box marginTop={4}>
          <Button
            colorScheme="destructive"
            iconType="filled"
            size="small"
            type="button"
            variant="text"
            loading={loadingSubmit}
            disabled={loadingSubmit}
            onClick={async () => {
              const res = await submitApplication({
                variables: {
                  input: {
                    id: application.id,
                    event: 'ABORT',
                    answers: application.answers,
                  },
                },
              })

              if (res?.data) {
                // Takes them to the next state (which loads the relevant form)
                refetch?.()
              }
            }}
          >
            {formatMessage(
              parentalLeaveFormMessages.editFlow.editsNotApprovedDiscardButton,
            )}
          </Button>
          <Box display="inlineBlock" marginLeft={2}>
            <Button
              colorScheme="default"
              iconType="filled"
              size="small"
              type="button"
              variant="primary"
              loading={loadingSubmit}
              disabled={loadingSubmit}
              onClick={async () => {
                const res = await submitApplication({
                  variables: {
                    input: {
                      id: application.id,
                      event: 'MODIFY',
                      answers: application.answers,
                    },
                  },
                })

                if (res?.data) {
                  // Takes them to the next state (which loads the relevant form)
                  refetch?.()
                }
              }}
            >
              {formatMessage(
                parentalLeaveFormMessages.editFlow.editsNotApprovedEditButton,
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default EditsRequireAction
