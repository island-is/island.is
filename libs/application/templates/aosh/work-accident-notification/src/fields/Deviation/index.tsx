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

export const Deviation: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const answers = application.answers as WorkAccidentNotification

  return (
    <CausesAndEffects
      externalDataKey={'aoshData.data.workDeviation'}
      heading={causeAndConsequences.deviations.heading}
      subHeading={causeAndConsequences.deviations.subHeading}
      answerId={'deviations.workDeviations'}
      mostSeriousAnswerId={'deviations.workDeviationsMostSerious'}
      screenId={'deviations'}
      mostSeriousAnswer={
        (answers?.deviations?.workDeviationsMostSerious as string) || ''
      }
      {...props}
    />
  )
}
