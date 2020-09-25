import React, { FC } from 'react'
import { RepeaterScreen } from '../types'
import { Button } from '@island.is/island-ui/core'
import { Answer, FormValue } from '@island.is/application/template'

const FormRepeater: FC<{
  expandRepeater: (repeater: RepeaterScreen) => void
  formValue: FormValue
  repeater: RepeaterScreen
}> = ({ expandRepeater, formValue, repeater }) => {
  const items: Answer = formValue[repeater.id]
  return (
    <div>
      {items &&
        repeater.labelKey &&
        (items as Answer[])
          .map((item) => (item as FormValue)[repeater.labelKey])
          .join(', ')}
      <Button onClick={() => expandRepeater(repeater)}>Add a new one</Button>
    </div>
  )
}

export default FormRepeater
