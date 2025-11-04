import { Dispatch, FC, SetStateAction } from 'react'

import { Input } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase, useDeb } from '@island.is/judicial-system-web/src/utils/hooks'

import SectionHeading from '../SectionHeading/SectionHeading'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
}

const InputPenalties: FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { updateCase } = useCase()

  useDeb(workingCase, 'penalties')

  return (
    <>
      <SectionHeading
        title="Viðurlög - athugasemdir sækjanda"
        tooltip="Athugasemdir sækjanda eru einungis sýnilegar notendum hjá þínu embætti."
      />
      <Input
        name="penalties"
        label="Athugasemdir"
        placeholder="Hver er hæfileg refsing að mati ákæruvalds?"
        value={workingCase.penalties ?? ''}
        onChange={(event) =>
          removeTabsValidateAndSet(
            'penalties',
            event.target.value,
            [],
            setWorkingCase,
          )
        }
        onBlur={(event) =>
          validateAndSendToServer(
            'penalties',
            event.target.value,
            [],
            workingCase,
            updateCase,
          )
        }
        textarea
        autoComplete="off"
        rows={10}
        autoExpand={{ on: true, maxHeight: 300 }}
      />
    </>
  )
}

export default InputPenalties
