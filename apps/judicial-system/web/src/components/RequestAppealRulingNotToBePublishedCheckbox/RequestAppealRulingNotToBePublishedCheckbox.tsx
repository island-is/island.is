import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Checkbox } from '@island.is/island-ui/core'

import { CaseAppealState } from '../../graphql/schema'
import { useCase } from '../../utils/hooks'
import BlueBox from '../BlueBox/BlueBox'
import { FormContext } from '../FormProvider/FormProvider'
import { requestAppealRulingNotToBePublishedCheckbox as strings } from './RequestAppealRulingNotToBePublishedCheckbox.strings'

const RequestAppealRulingNotToBePublishedCheckbox: React.FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { setAndSendCaseToServer } = useCase()

  return (
    <Box component="section" marginBottom={10}>
      <BlueBox>
        <Checkbox
          label={formatMessage(strings.requestAppealRulingNotToBePublished)}
          name="requestAppealRulingNotToBePublished"
          checked={workingCase.requestAppealRulingNotToBePublished}
          disabled={workingCase.appealState === CaseAppealState.COMPLETED}
          onChange={(event) => {
            setAndSendCaseToServer(
              [
                {
                  requestAppealRulingNotToBePublished: event.target.checked,
                  force: true,
                },
              ],
              workingCase,
              setWorkingCase,
            )
          }}
          large
          filled
        />
      </BlueBox>
    </Box>
  )
}

export default RequestAppealRulingNotToBePublishedCheckbox
