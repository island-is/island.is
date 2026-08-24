import type { FC } from 'react'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Checkbox } from '@island.is/island-ui/core'
import BlueBox from '@island.is/judicial-system-web/src/components/BlueBox/BlueBox'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import type { AppealCase } from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealCaseState } from '@island.is/judicial-system-web/src/graphql/schema'
import { toggleInArray } from '@island.is/judicial-system-web/src/utils/formHelper'
import { useAppealCase } from '@island.is/judicial-system-web/src/utils/hooks'

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
