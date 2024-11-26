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

interface CauseOfInjuryProps {
  field: {
    props: {
      index: number
    }
  }
}

export const CauseOfInjury: FC<
  React.PropsWithChildren<CauseOfInjuryProps & FieldBaseProps>
> = (props) => {
  const { application } = props
  const answers = application.answers as WorkAccidentNotification
  const idx = props.field?.props?.index

  return (
    <CausesAndEffects
      majorGroupLength={1}
      externalDataKey={'aoshData.data.contactModeOfInjury'}
      heading={causeAndConsequences.causeOfInjury.heading}
      subHeading={causeAndConsequences.causeOfInjury.subHeading}
      answerId={`causeOfInjury[${idx}].contactModeOfInjury`}
      mostSeriousAnswerId={`causeOfInjury[${idx}].contactModeOfInjuryMostSerious`}
      screenId={'causeOfInjury'}
      mostSeriousAnswer={
        (answers?.causeOfInjury?.[idx]
          ?.contactModeOfInjuryMostSerious as string) || ''
      }
      {...props}
    />
  )
}
