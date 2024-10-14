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

export const CauseOfInjury: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const answers = application.answers as WorkAccidentNotification

  return (
    <CausesAndEffects
      externalDataKey={'aoshData.data.contactModeOfInjury'}
      heading={causeAndConsequences.causeOfInjury.heading}
      subHeading={causeAndConsequences.causeOfInjury.subHeading}
      answerId={'causeOfInjury.contactModeOfInjury'}
      mostSeriousAnswerId={'causeOfInjury.contactModeOfInjuryMostSerious'}
      screenId={'causeOfInjury'}
      mostSeriousAnswer={
        (answers?.causeOfInjury?.contactModeOfInjuryMostSerious as string) || ''
      }
      {...props}
    />
  )
}
