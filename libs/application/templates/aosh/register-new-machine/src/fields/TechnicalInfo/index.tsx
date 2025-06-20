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
import { CategoryType, TechInfoItem } from '../../shared/types'
import { formFieldMapper } from './formFieldMapper'
import { application as applicationMessage } from '../../lib/messages'
import { formatDate } from '../../utils'

export const technicalInfoInputs = gql`
  ${TECHNICAL_INFO_INPUTS}
`

export const TechnicalInfo: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field, setBeforeSubmitCallback } = props
  const { formatMessage, locale, lang } = useLocale()

  const machineCategory = getValueViaPath(
    application.answers,
    'machine.aboutMachine.category',
    { nameIs: '', nameEn: '' },
  ) as CategoryType
  const machineSubCategory = getValueViaPath(
    application.answers,
    'machine.aboutMachine.subcategory',
    { nameIs: '', nameEn: '' },
  ) as CategoryType

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
    runQuery({
      variables: {
        parentCategory: machineCategory.nameIs,
        subCategory: machineSubCategory.nameIs,
      },
    })
  }, [machineCategory, machineSubCategory])

  setBeforeSubmitCallback?.(async () => {
    setDisplayError(false)
    const techInfoAnswer = techInfoItems?.map(
      ({ name, required, label, labelEn, maxLength, type }, index) => {
        const answer = name ? watchTechInfoFields[name] : ''
        if (
          (required && answer.length === 0) ||
          (required &&
            (type === 'int' || type === 'float'
              ? maxLength
                ? answer.length > maxLength
                : false
              : false))
        ) {
          setDisplayError(true)
          return 'error'
        }
        const isAnswer =
          type === 'dateTime'
            ? formatDate(answer)
            : typeof answer === 'object'
            ? answer.nameIs
            : type === 'float'
            ? parseFloat(answer).toLocaleString()
            : answer
        const enAnswer =
          type === 'dateTime'
            ? formatDate(answer)
            : typeof answer === 'object'
            ? answer.nameEn
            : type === 'float'
            ? parseFloat(answer).toLocaleString()
            : answer
        setValue(`techInfo[${index}].variableName`, name)
        setValue(`techInfo[${index}].value.nameIs`, isAnswer)
        setValue(`techInfo[${index}].value.nameEn`, enAnswer)
        setValue(`techInfo[${index}].label`, label)
        setValue(`techInfo[${index}].labelEn`, labelEn)
        return {
          variableName: name,
          value: {
            nameIs: isAnswer,
            nameEn: enAnswer,
          },

          label,
          labelEn,
        }
      },
    )

    if (
      loading ||
      connectionError ||
      techInfoAnswer?.some((val) => val === 'error')
    ) {
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
          {lang === 'is' ? machineCategory.nameIs : machineCategory.nameEn}:{' '}
          {lang === 'is'
            ? machineSubCategory.nameIs
            : machineSubCategory.nameEn}
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
            <GridColumn key={item.name} span={['1/1', '1/2']}>
              {formFieldMapper({
                item,
                props,
                displayError,
                watchTechInfoFields,
                formatMessage,
                lang,
              })}
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
