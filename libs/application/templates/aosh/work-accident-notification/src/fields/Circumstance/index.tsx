import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { causeAndConsequences } from '../../lib/messages'
import { CausesAndEffects } from '../Components/CausesAndEffects'
import { WorkAccidentNotification } from '../..'

interface CircumstanceProps {
  field: {
    props: {
      index: number
    }
  }
}

export const Circumstance: FC<
  React.PropsWithChildren<CircumstanceProps & FieldBaseProps>
> = (props) => {
  const { application } = props
  const answers = application.answers as WorkAccidentNotification
  const idx = props.field?.props?.index

  return (
    <CausesAndEffects
      majorGroupLength={1}
      externalDataKey={'aoshData.data.specificPhysicalActivity'}
      heading={causeAndConsequences.circumstances.heading}
      subHeading={causeAndConsequences.circumstances.subHeading}
      answerId={`circumstances[${idx}].physicalActivities`}
      mostSeriousAnswerId={`circumstances[${idx}].physicalActivitiesMostSerious`}
      screenId={'circumstances'}
      mostSeriousAnswer={
        (answers?.circumstances?.[idx]
          ?.physicalActivitiesMostSerious as string) || ''
      }
      {...props}
    />
  )
}
