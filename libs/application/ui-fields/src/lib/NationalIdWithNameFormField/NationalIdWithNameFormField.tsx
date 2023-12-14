import {
  FieldBaseProps,
  NationalIdWithNameField,
} from '@island.is/application/types'
import { NationalIdWithName } from '@island.is/application/ui-components'
import { FC } from 'react'

interface Props extends FieldBaseProps {
  field: NationalIdWithNameField
}

export const NationalIdWithNameFormField: FC<
  React.PropsWithChildren<Props>
> = ({ application, field }) => {
  return (
    <NationalIdWithName
      id={field.id}
      application={application}
      customId={field.customId}
      customNationalIdLabel={field.customNationalIdLabel}
      customNameLabel={field.customNameLabel}
      onNationalIdChange={field.onNationalIdChange}
      onNameChange={field.onNameChange}
      nationalIdDefaultValue={field.nationalIdDefaultValue}
      nameDefaultValue={field.nameDefaultValue}
      errorMessage={field.errorMessage}
      disabled={field.disabled}
      minAgePerson={field.minAgePerson}
    />
  )
}
