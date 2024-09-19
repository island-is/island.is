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
import { friggOptionsQuery } from '../../graphql/queries'
import {
  FriggOptionsQuery,
  FriggOptionsQueryVariables,
} from '../../types/schema'

type FriggOptionsAsyncSelectFieldProps = {
  field: {
    props: {
      optionsType: OptionsType
      placeholder: FormText
      isMulti?: boolean
    }
  }
}

const FriggOptionsAsyncSelectField: FC<
  React.PropsWithChildren<FieldBaseProps & FriggOptionsAsyncSelectFieldProps>
> = ({ error, field, application }) => {
  const { lang } = useLocale()
  const { title, props, defaultValue, id } = field
  const { isMulti = true, optionsType, placeholder } = props

  return (
    <AsyncSelectFormField
      application={application}
      error={error}
      field={{
        type: FieldTypes.ASYNC_SELECT,
        component: FieldComponents.ASYNC_SELECT,
        children: undefined,
        id,
        title,
        placeholder,
        defaultValue,
        loadingError: coreErrorMessages.failedDataProvider,
        loadOptions: async ({ apolloClient }) => {
          const { data } = await apolloClient.query<
            FriggOptionsQuery,
            FriggOptionsQueryVariables
          >({
            query: friggOptionsQuery,
            variables: {
              type: {
                type: optionsType,
              },
            },
          })

          return (
            data?.friggOptions?.flatMap(({ options }) =>
              options.flatMap(({ value, key }) => {
                let content = value.find(
                  ({ language }) => language === lang,
                )?.content
                if (!content) {
                  content = value.find(
                    ({ language }) => language === 'is',
                  )?.content
                }
                return { value: key ?? '', label: content ?? '' }
              }),
            ) ?? []
          )
        },
        isMulti,
        backgroundColor: 'blue',
      }}
    />
  )
}

export default FriggOptionsAsyncSelectField
