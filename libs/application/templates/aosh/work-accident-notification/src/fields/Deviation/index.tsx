import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { causeAndConsequences } from '../../lib/messages'
import { WorkAccidentNotification } from '../../lib/dataSchema'
import { CausesAndEffects } from '../Components/CausesAndEffects'

interface DeviationProps {
  field: {
    props: {
      index: number
    }
  }
}

export const Deviation: FC<
  React.PropsWithChildren<DeviationProps & FieldBaseProps>
> = (props) => {
  const { application } = props
  const answers = application.answers as WorkAccidentNotification
  const idx = props.field?.props?.index

  return (
    <CausesAndEffects
      majorGroupLength={1}
      externalDataKey={'aoshData.data.workDeviation'}
      heading={causeAndConsequences.deviations.heading}
      subHeading={causeAndConsequences.deviations.subHeading}
      answerId={`deviations[${idx}].workDeviations`}
      mostSeriousAnswerId={`deviations[${idx}].workDeviationsMostSerious`}
      screenId={'deviations'}
      mostSeriousAnswer={
        (answers?.deviations?.[idx]?.workDeviationsMostSerious as string) || ''
      }
      {...props}
    />
  )
}
