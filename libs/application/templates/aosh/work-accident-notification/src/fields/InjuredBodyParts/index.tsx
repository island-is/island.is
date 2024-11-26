import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { causeAndConsequences } from '../../lib/messages'
import { WorkAccidentNotification } from '../../lib/dataSchema'
import { CausesAndEffects } from '../Components/CausesAndEffects'
import { getValueViaPath } from '@island.is/application/core'

interface InjuredBodyPartsProps {
  field: {
    props: {
      index: number
    }
  }
}

export const InjuredBodyParts: FC<
  React.PropsWithChildren<InjuredBodyPartsProps & FieldBaseProps>
> = (props) => {
  const { application } = props
  const answers = application.answers as WorkAccidentNotification
  const idx = props.field?.props?.index

  return (
    <CausesAndEffects
      majorGroupLength={1}
      externalDataKey={'aoshData.data.partOfBodyInjured'}
      heading={causeAndConsequences.injuredBodyParts.heading}
      subHeading={causeAndConsequences.injuredBodyParts.subHeading}
      answerId={`injuredBodyParts[${idx}].partOfBodyInjured`}
      mostSeriousAnswerId={`injuredBodyParts[${idx}].partOfBodyInjuredMostSerious`}
      screenId={'injuredBodyParts'}
      mostSeriousAnswer={
        getValueViaPath<string>(
          answers,
          `injuredBodyParts[${idx}].partOfBodyInjuredMostSerious`,
        ) || ''
      }
      {...props}
    />
  )
}
