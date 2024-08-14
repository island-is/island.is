import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { FC, useEffect, useState } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { TECHNICAL_INFO_INPUTS } from '../../graphql/queries'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { TechInfoItem } from '../../shared/types'
import { formFieldMapper } from './formFieldMapper'
import { application as applicationMessage } from '../../lib/messages'

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

  const [techInfoItems, setTechInfoItems] = useState<TechInfoItem[]>()
  const [displayError, setDisplayError] = useState<boolean>(false)
  const [connectionError, setConnectionError] = useState<boolean>(false)
  const { setValue, watch } = useFormContext()
  const watchTechInfoFields = watch(`${field.id}`)

  const [runQuery, { loading }] = useLazyQuery(technicalInfoInputs, {
    onCompleted(result) {
      setConnectionError(false)
      if (result?.getTechnicalInfoInputs) {
        setTechInfoItems(result?.getTechnicalInfoInputs)
      } else {
        setConnectionError(true)
      }
    },
    onError() {
      setConnectionError(true)
    },
  })

  useEffect(() => {
    // Call subcategory
    runQuery({
      variables: {
        parentCategory: machineCategory,
      },
    })
  }, [machineCategory])

  setBeforeSubmitCallback?.(async () => {
    // Renna yfir listan í techInfoItems og finna í listanum watchTechInfoFields
    // Ef það er required þá tékka hvort það sé útfyllt
    // Síðan setja í answers með nafninu og value
    setDisplayError(false)
    const techInfoAnswer = techInfoItems?.map(
      ({ variableName, required, label }, index) => {
        const answer = variableName ? watchTechInfoFields[variableName] : ''
        if (required && answer.length === 0) {
          setDisplayError(true)
          return 'error'
        }
        setValue(`techInfo[${index}].variableName`, variableName)
        setValue(`techInfo[${index}].value`, answer)
        setValue(`techInfo[${index}].label`, label)
        return { variableName, value: answer, label }
      },
    )

    if (techInfoAnswer?.some((val) => val === 'error')) {
      return [false, '']
    }

    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            techInfo: techInfoAnswer,
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
      {connectionError && (
        <AlertMessage
          type="error"
          message={formatMessage(applicationMessage.connectionError)}
        />
      )}
    </Box>
  )
}
