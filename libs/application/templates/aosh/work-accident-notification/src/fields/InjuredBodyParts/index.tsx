import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { causeAndConsequences } from '../../lib/messages'
import { Option } from '../Components/types'
import { WorkAccidentNotification } from '../../lib/dataSchema'
import { CausesAndEffects } from '../Components/CausesAndEffects'

export type OptionAndKey = {
  option: Option
  key: string
}

export const InjuredBodyParts: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const answers = application.answers as WorkAccidentNotification

  return (
    <CausesAndEffects
      externalDataKey={'aoshData.data.partOfBodyInjured'}
      heading={causeAndConsequences.injuredBodyParts.heading}
      subHeading={causeAndConsequences.injuredBodyParts.subHeading}
      answerId={'injuredBodyParts.partOfBodyInjured'}
      mostSeriousAnswerId={'injuredBodyParts.partOfBodyInjuredMostSerious'}
      screenId={'injuredBodyParts'}
      mostSeriousAnswer={
        (answers?.injuredBodyParts?.partOfBodyInjured as string) || ''
      }
      {...props}
    />
  )
}
