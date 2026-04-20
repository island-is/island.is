import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Checkbox } from '@island.is/island-ui/core'

import { AppealCaseState } from '../../graphql/schema'
import { setCheckboxAndSendToServer } from '../../utils/formHelper'
import { useCase } from '../../utils/hooks'
import BlueBox from '../BlueBox/BlueBox'
import { FormContext } from '../FormProvider/FormProvider'
import { UserContext } from '../UserProvider/UserProvider'
import { requestAppealRulingNotToBePublishedCheckbox as strings } from './RequestAppealRulingNotToBePublishedCheckbox.strings'

const RequestAppealRulingNotToBePublishedCheckbox: FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateCase } = useCase()
  const { user } = useContext(UserContext)

  return (
    <BlueBox>
      <Checkbox
        label={formatMessage(strings.requestAppealRulingNotToBePublished)}
        name="requestAppealRulingNotToBePublished"
        checked={
          user &&
          user.role !== undefined &&
          user.role !== null &&
          workingCase.appealCase?.requestAppealRulingNotToBePublished?.includes(
            user.role,
          )
        }
        disabled={
          workingCase.appealCase?.appealState === AppealCaseState.COMPLETED
        }
        onChange={() => {
          if (!user || user.role === undefined || user.role === null) return

          setCheckboxAndSendToServer(
            'requestAppealRulingNotToBePublished',
            user.role,
            workingCase,
            setWorkingCase,
            updateCase,
          )
        }}
        large
        filled
      />
    </BlueBox>
  )
}

export default RequestAppealRulingNotToBePublishedCheckbox
