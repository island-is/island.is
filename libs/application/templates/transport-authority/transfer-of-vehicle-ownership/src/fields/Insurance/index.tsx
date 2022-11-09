import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps, Option } from '@island.is/application/types'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { insurance, review } from '../../lib/messages'
import { SelectController } from '@island.is/shared/form-fields'
import { ReviewScreenProps } from '../../types'
import { InsuranceCompany } from '@island.is/api/schema'
import { useFormContext } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

export const Insurance: FC<FieldBaseProps & ReviewScreenProps> = ({
  application,
  field,
  setStep,
  setInsurance,
}) => {
  const { locale, formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)
  const { id } = field
  const [selectedValue, setSelectedValue] = useState<Option | null>(null)

  const insuranceCompanyList = getValueViaPath(
    application.externalData,
    'insuranceCompanyList.data',
    [],
  ) as InsuranceCompany[]

  const onChange = (option: Option) => {
    setSelectedValue(option)
  }

  const onBackButtonClick = () => {
    setStep('overview')
  }
  console.log(id)

  const onForwardButtonClick = async () => {
    // Save value here too
    if (selectedValue && setInsurance) {
      setInsurance(selectedValue.label as string)
      setValue('insurance.value', selectedValue.value)
      setValue('insurance.name', selectedValue.label)
      const res = await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ...application.answers,
              insurance: {
                value: selectedValue.value,
                name: selectedValue.label,
              },
            },
          },
          locale,
        },
      })
      console.log(res)
      setStep('overview')
    } else {
      console.log('error from onforwardbuttonclick')
      // display error message
    }
  }

  return (
    <Box>
      <Text variant="h2">{formatMessage(insurance.general.title)}</Text>
      <Text>{formatMessage(insurance.general.description)}</Text>
      <SelectController
        label={formatMessage(insurance.labels.selectTitle)}
        placeholder={formatMessage(insurance.labels.selectPlaceholder)}
        id="insurance.value"
        name="insurance.value"
        onSelect={(option) => onChange(option as Option)}
        options={insuranceCompanyList.map((insurance, index) => {
          return {
            value: insurance.code || index,
            label: insurance.name || '',
          }
        })}
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
