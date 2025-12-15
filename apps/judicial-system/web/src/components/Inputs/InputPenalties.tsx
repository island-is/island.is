import { Dispatch, FC, SetStateAction, useRef, useState } from 'react'
import { useDebounce } from 'react-use'

import { Input } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import SectionHeading from '../SectionHeading/SectionHeading'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
}

const InputPenalties: FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { updateCase } = useCase()
  const hasRunDebounce = useRef<boolean>(false)
  const [value, setValue] = useState<string>(workingCase.penalties ?? '')

  useDebounce(
    async () => {
      if (!hasRunDebounce.current) {
        hasRunDebounce.current = true
        return
      }

      setWorkingCase((currentWorkingCase) => ({
        ...currentWorkingCase,
        penalties: value ?? null,
      }))
      await updateCase(workingCase.id, {
        penalties: value ?? null,
      })
    },
    200,
    [value],
  )

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
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
        }}
        textarea
        autoComplete="off"
        rows={10}
      />
    </>
  )
}

export default InputPenalties
