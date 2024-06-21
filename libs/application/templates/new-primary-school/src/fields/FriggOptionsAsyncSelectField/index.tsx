import { coreErrorMessages } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  FormText,
} from '@island.is/application/types'
import { AsyncSelectFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { OptionsType } from '../../lib/constants'
import { getOptionsListByType } from '../../lib/newPrimarySchoolUtils'

type FriggOptionsAsyncSelectFieldProps = {
  field: {
    props: {
      optionsType: OptionsType
      placeholder: FormText
    }
  }
}

const FriggOptionsAsyncSelectField: FC<
  React.PropsWithChildren<FieldBaseProps & FriggOptionsAsyncSelectFieldProps>
> = ({ error, field, application }) => {
  const { lang } = useLocale()
  const { title, props } = field

  return (
    <AsyncSelectFormField
      application={application}
      error={error}
      field={{
        type: FieldTypes.ASYNC_SELECT,
        component: FieldComponents.ASYNC_SELECT,
        children: undefined,
        id: field.id,
        title,
        placeholder: props.placeholder,
        loadingError: coreErrorMessages.failedDataProvider,
        loadOptions: async ({ apolloClient }) => {
          return await getOptionsListByType(
            apolloClient,
            props.optionsType,
            lang,
          )
        },
        isMulti: true,
        backgroundColor: 'blue',
      }}
    />
  )
}

export default FriggOptionsAsyncSelectField
