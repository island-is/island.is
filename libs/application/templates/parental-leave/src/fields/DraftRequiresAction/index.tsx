import React, { FC } from 'react'
import { useMutation } from '@apollo/client'
import { MessageDescriptor } from '@formatjs/intl'

import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { handleServerError } from '@island.is/application/ui-components'

import { parentalLeaveFormMessages } from '../../lib/messages'
import { States as ApplicationStates } from '../../constants'

const DraftRequireAction: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  refetch,
}) => {
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleServerError(e, formatMessage),
    },
  )

  const { formatMessage } = useLocale()

  const descKey: { [key: string]: MessageDescriptor } = {
    [ApplicationStates.OTHER_PARENT_ACTION]:
      parentalLeaveFormMessages.draftFlow.draftNotApprovedOtherParentDesc,
    [ApplicationStates.EMPLOYER_ACTION]:
      parentalLeaveFormMessages.draftFlow.draftNotApprovedEmployerDesc,
    [ApplicationStates.VINNUMALASTOFNUN_ACTION]:
      parentalLeaveFormMessages.draftFlow.draftNotApprovedVMLSTDesc,
    [ApplicationStates.ADDITIONAL_DOCUMENTS_REQUIRED]:
      parentalLeaveFormMessages.draftFlow.draftAdditionalDocumentRequiredDesc,
  }

  return (
    <Box>
      <Box>
        <FieldDescription
          description={formatMessage(descKey[application.state])}
        />
      </Box>
      <Box marginTop={10}>
        <Text>
          {formatMessage(parentalLeaveFormMessages.draftFlow.modifyDraftDesc)}
        </Text>
        <Box marginTop={4}>
          <Box display="inlineBlock">
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
                      event: 'EDIT',
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
                parentalLeaveFormMessages.draftFlow.modifyDraftButton,
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DraftRequireAction
