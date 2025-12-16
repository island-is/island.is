import { FC } from 'react'

import { Input } from '@island.is/island-ui/core'
import { useDebouncedInput } from '@island.is/judicial-system-web/src/utils/hooks'

import SectionHeading from '../SectionHeading/SectionHeading'

const InputPenalties: FC = () => {
  const penaltiesInput = useDebouncedInput('penalties', [])

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
        value={penaltiesInput.value}
        onChange={(evt) => penaltiesInput.onChange(evt.target.value)}
        textarea
        autoComplete="off"
        rows={10}
      />
    </>
  )
}

export default InputPenalties
