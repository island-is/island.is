import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  AsyncSearch,
  Box,
  GridColumn,
  GridRow,
  LoadingDots,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { FC, useCallback, useEffect, useState } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { machine } from '../../lib/messages'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import debounce from 'lodash/debounce'
import { getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import {
  MACHINE_MODELS,
  MACHINE_SUB_CATEGORIES,
  TECHNICAL_INFO_INPUTS,
} from '../../graphql/queries'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useLazyMachineCategory } from '../../hooks/useLazyMachineCategory'
import { TechInfoItem } from '../../shared/types'
import { formFieldMapper } from './formFieldMapper'

export const technicalInfoInputs = gql`
  ${TECHNICAL_INFO_INPUTS}
`

export const TechnicalInfo: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field, setBeforeSubmitCallback } = props
  const { formatMessage, locale } = useLocale()

  const machineCategory = getValueViaPath(
    application.answers,
    'machine.aboutMachine.category',
    '',
  ) as string
  const machineSubCategory = getValueViaPath(
    application.answers,
    'machine.aboutMachine.subcategory',
    '',
  ) as string

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [machineModels, setMachineModels] =
    useState<{ value: string; label: string }[]>()
  const [category, setCategory] = useState<string>(machineCategory)
  const [techInfoItems, setTechInfoItems] = useState<TechInfoItem[]>()
  const [displayError, setDisplayError] = useState<boolean>(false)
  const { setValue, register, watch } = useFormContext()
  const watchTechInfoFields = watch(`${field.id}`)

  const [runQuery, { loading }] = useLazyQuery(technicalInfoInputs, {
    onCompleted(result) {
      console.log(result)
      if (result?.getTechnicalInfoInputs) {
        setTechInfoItems(result?.getTechnicalInfoInputs)
      }
      // float/int -> number
      // has values -> select
      // bool -> já/nei
    },
    onError() {
      // Something happens? Maybe a message to the user?
    },
  })

  useEffect(() => {
    // Call subcategory
    runQuery({
      variables: {
        parentCategory: machineCategory,
      },
    })
  }, [category])
  console.log(watchTechInfoFields)

  setBeforeSubmitCallback?.(async () => {
    // Renna yfir listan í techInfoItems og finna í listanum watchTechInfoFields
    // Ef það er required þá tékka hvort það sé útfyllt
    // Síðan setja í answers með nafninu og value
    setDisplayError(false)
    const techInfoAnswer = techInfoItems?.map(({ variableName, required }) => {
      const answer = variableName ? watchTechInfoFields[variableName] : ''
      if (required && answer.length === 0) {
        setDisplayError(true)
        return 'error'
      }
      return { variableName, value: answer }
    })

    if (techInfoAnswer?.some((val) => val === 'error')) {
      return [false, '']
    }

    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            techInfo: techInfoAnswer,
            ...application.answers,
          },
        },
        locale,
      },
    })
    return [true, null]
  })

  return (
    <Box paddingTop={2}>
      <Box>
        <Text variant="h5">
          {machineCategory}: {machineSubCategory}
        </Text>
      </Box>
      <GridRow>
        {loading && (
          <Box padding={2}>
            <LoadingDots large />
          </Box>
        )}
        {techInfoItems?.map((item) => {
          return (
            <GridColumn key={item.variableName} span={['1/1', '1/2']}>
              {formFieldMapper(
                item,
                props,
                displayError,
                watchTechInfoFields,
                formatMessage,
              )}
            </GridColumn>
          )
        })}
      </GridRow>
    </Box>
  )
}
