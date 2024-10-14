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

export const Circumstance: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application } = props
  const answers = application.answers as WorkAccidentNotification

  return (
    <CausesAndEffects
      externalDataKey={'aoshData.data.specificPhysicalActivity'}
      heading={causeAndConsequences.circumstances.heading}
      subHeading={causeAndConsequences.circumstances.subHeading}
      answerId={'circumstances.physicalActivities'}
      mostSeriousAnswerId={'circumstances.physicalActivitiesMostSerious'}
      screenId={'circumstances'}
      mostSeriousAnswer={
        (answers?.circumstances?.physicalActivitiesMostSerious as string) || ''
      }
      {...props}
    />
  )
}
