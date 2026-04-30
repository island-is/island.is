import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Checkbox } from '@island.is/island-ui/core'

import { AppealCase, AppealCaseState } from '../../graphql/schema'
import { toggleInArray } from '../../utils/formHelper'
import { useAppealCase } from '../../utils/hooks'
import BlueBox from '../BlueBox/BlueBox'
import { FormContext } from '../FormProvider/FormProvider'
import { UserContext } from '../UserProvider/UserProvider'
import { requestAppealRulingNotToBePublishedCheckbox as strings } from './RequestAppealRulingNotToBePublishedCheckbox.strings'

const RequestAppealRulingNotToBePublishedCheckbox: FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { updateAppealCase } = useAppealCase()
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
          if (!workingCase.appealCase?.id) return

          const updated = toggleInArray(
            workingCase.appealCase?.requestAppealRulingNotToBePublished,
            user.role,
          )

          setWorkingCase((prevWorkingCase) => ({
            ...prevWorkingCase,
            appealCase: {
              ...prevWorkingCase.appealCase,
              requestAppealRulingNotToBePublished: updated,
            } as AppealCase,
          }))

          updateAppealCase(workingCase.id, workingCase.appealCase.id, {
            requestAppealRulingNotToBePublished: updated,
          })
        }}
        large
        filled
      />
    </BlueBox>
  )
}

export default RequestAppealRulingNotToBePublishedCheckbox
