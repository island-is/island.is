import { EducationFriggOptionsListInput, Query } from '@island.is/api/schema'
import { coreErrorMessages } from '@island.is/application/core'
import {
  Application,
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  FormText,
} from '@island.is/application/types'
import { AsyncSelectFormField } from '@island.is/application/ui-fields'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { friggOptionsQuery } from '../../graphql/queries'
import { OptionsType, OTHER_OPTION } from '../../utils/constants'

type FriggOptionsAsyncSelectFieldProps = {
  field: {
    props: {
      optionsType: OptionsType | ((application: Application) => OptionsType)
      placeholder: FormText
      isMulti?: boolean
      useIdAndKey?: boolean
    }
  }
}

const FriggOptionsAsyncSelectField: FC<
  React.PropsWithChildren<FieldBaseProps & FriggOptionsAsyncSelectFieldProps>
> = ({ error, field, application }) => {
  const { lang } = useLocale()
  const { title, props, defaultValue, id, marginBottom } = field
  const {
    isMulti = false,
    optionsType,
    placeholder,
    useIdAndKey = false,
  } = props

  let friggOptionsType: OptionsType
  if (typeof optionsType === 'function') {
    friggOptionsType = optionsType(application)
  } else {
    friggOptionsType = optionsType
  }

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
        marginBottom,
        loadingError: coreErrorMessages.failedDataProvider,
        loadOptions: async ({ apolloClient }) => {
          const { data } = await apolloClient.query<
            Query,
            { type: EducationFriggOptionsListInput }
          >({
            query: friggOptionsQuery,
            variables: {
              type: {
                type: friggOptionsType,
              },
            },
          })

          let otherContentValue = ''

          const options =
            data?.friggOptions
              ?.flatMap(({ options }) =>
                options.flatMap(({ value, key, id }) => {
                  const content = value.find(
                    ({ language }) => language === lang,
                  )?.content

                  if (!content) return []

                  const contentValue = useIdAndKey ? `${id}::${key}` : id

                  if (key === OTHER_OPTION) otherContentValue = contentValue

                  return { value: contentValue, label: content }
                }),
              )
              .sort((a, b) => a.label.localeCompare(b.label)) ?? []

          const otherIndex = options.findIndex(
            (option) => option.value === otherContentValue,
          )

          if (otherIndex >= 0) {
            options.push(options.splice(otherIndex, 1)[0])
          }

          return options
        },
        isMulti,
        backgroundColor: 'blue',
      }}
    />
  )
}

export default FriggOptionsAsyncSelectField
