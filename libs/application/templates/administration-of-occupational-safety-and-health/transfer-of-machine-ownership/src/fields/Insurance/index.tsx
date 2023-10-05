import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps, Option } from '@island.is/application/types'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { insurance, review, error } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { InsuranceCompany, ReviewScreenProps } from '../../shared'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

export const Insurance: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ application, setStep, setInsurance }) => {
  const { locale, formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const savedSelectedValue = getValueViaPath(
    application.answers,
    'insurance',
    undefined,
  ) as { value: string; name: string } | undefined

  const [selectedValue, setSelectedValue] = useState<Option | null>(
    savedSelectedValue?.value
      ? { value: savedSelectedValue.value, label: savedSelectedValue.name }
      : null,
  )
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )

  const insuranceCompanyList = getValueViaPath(
    application.externalData,
    'insuranceCompanyList.data',
    [],
  ) as InsuranceCompany[]

  const onChange = (option: Option) => {
    setErrorMessage(undefined)
    setSelectedValue(option)
  }

  const onBackButtonClick = () => {
    setErrorMessage(undefined)
    setStep && setStep('overview')
  }

  const onForwardButtonClick = async () => {
    if (selectedValue && setInsurance) {
      setValue('insurance.value', selectedValue.value)
      setValue('insurance.name', selectedValue.label)
      const res = await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              insurance: {
                value: selectedValue.value,
                name: selectedValue.label,
              },
            },
          },
          locale,
        },
      })
      if (!res.data) {
        setErrorMessage(formatMessage(error.couldNotUpdateApplication))
      } else {
        setInsurance(selectedValue.value as string)
        setErrorMessage(undefined)
        setStep && setStep('overview')
      }
    } else {
      setErrorMessage(formatMessage(error.noInsuranceSelected))
    }
  }

  const getOptions = () => {
    const options = insuranceCompanyList.map((insurance, index) => {
      return {
        value: insurance.code || index,
        label: insurance.name || '',
      }
    })

    return options
  }

  return (
    <Box>
      <Text marginBottom={1} variant="h2">
        {formatMessage(insurance.general.title)}
      </Text>
      <Text marginBottom={5}>
        {formatMessage(insurance.general.description)}
      </Text>
      <SelectController
        label={formatMessage(insurance.labels.selectTitle)}
        placeholder={formatMessage(insurance.labels.selectPlaceholder)}
        id="insurance.value"
        name="insurance.value"
        error={errorMessage}
        onSelect={(option) => onChange(option as Option)}
        options={getOptions()}
        backgroundColor="blue"
      />
      <Box style={{ marginTop: '40vh' }}>
        <Divider />
        <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
          <Button variant="ghost" onClick={onBackButtonClick}>
            {formatMessage(review.buttons.back)}
          </Button>
          <Button icon="arrowForward" onClick={onForwardButtonClick}>
            {formatMessage(insurance.labels.approveButton)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
