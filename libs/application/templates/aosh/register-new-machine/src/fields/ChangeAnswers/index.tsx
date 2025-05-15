import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath, NO } from '@island.is/application/core'
import { PersonInformation } from '../../lib/dataSchema'

interface ChangeAnswersProps {
  field: {
    props: {
      sectionName: string
      questionName: string
      person: string
    }
  }
}

export const ChangeAnswers: FC<
  React.PropsWithChildren<FieldBaseProps & ChangeAnswersProps>
> = (props) => {
  const { application, field } = props
  const { sectionName, questionName, person } = field.props
  const { setValue } = useFormContext()

  const personInformation = getValueViaPath(
    application.answers,
    `${sectionName}.${person}`,
  ) as PersonInformation

  if (
    !personInformation ||
    !personInformation.address ||
    !personInformation.name ||
    !personInformation.nationalId ||
    !personInformation.postCode
  ) {
    setValue(`${sectionName}.${questionName}`, NO)
  }

  return null
}
