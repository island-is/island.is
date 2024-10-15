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

export const TypeOfInjury: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const answers = application.answers as WorkAccidentNotification

  return (
    <CausesAndEffects
      externalDataKey={'aoshData.data.typeOfInjury'}
      heading={causeAndConsequences.typeOfInjury.heading}
      subHeading={causeAndConsequences.typeOfInjury.subHeading}
      answerId={'typeOfInjury.typeOfInjury'}
      mostSeriousAnswerId={'typeOfInjury.typeOfInjuryMostSerious'}
      screenId={'typeOfInjury'}
      mostSeriousAnswer={(answers?.typeOfInjury?.typeOfInjury as string) || ''}
      {...props}
    />
  )
}
