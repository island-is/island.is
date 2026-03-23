import React, { FC, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import debounce from 'lodash/debounce'
import { InputController } from '@island.is/shared/form-fields'
import { ReviewScreenProps } from '../../shared'
import { NationalIdWithName } from '@island.is/application/ui-components'
import { error, information, review } from '../../lib/messages'
import { useFormContext } from 'react-hook-form'

export const ReviewOperatorRepeater: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ setStep, setBuyerOperator, buyerOperator = {}, ...props }) => {
  const { formatMessage } = useLocale()
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )
  const [genericErrorMessage, setGenericErrorMessage] = useState<
    string | undefined
  >(undefined)
  const { setValue } = useFormContext()
  const [name, setName] = useState<string | null>(buyerOperator?.name || null)
  const [nationalId, setNationalId] = useState<string | null>(
    buyerOperator?.nationalId || null,
  )
  const [email, setEmail] = useState<string | null>(
    buyerOperator?.email || null,
  )
  const [phone, setPhone] = useState<string | null>(
    buyerOperator?.phone || null,
  )

  const handleClear = async () => {
    setName(null)
    setNationalId(null)
    setEmail('')
    setPhone('')
    setBuyerOperator && setBuyerOperator({})
    buyerOperator = {}
    setValue('buyerOperator', { wasRemoved: 'true' })

    setGenericErrorMessage(undefined)
    setErrorMessage(undefined)
    setStep && setStep('overview')
  }

  const onBackButtonClick = () => {
    setErrorMessage(undefined)
    setGenericErrorMessage(undefined)
    setStep && setStep('overview')
  }

  const onForwardButtonClick = async () => {
    if (name && nationalId && email && phone && setBuyerOperator) {
      setBuyerOperator({ name, nationalId, email, phone })
      setValue('buyerOperator', { name, nationalId, email, phone })

      setGenericErrorMessage(undefined)
      setErrorMessage(undefined)
      setStep && setStep('overview')
    } else {
      setGenericErrorMessage(undefined)
      setErrorMessage(formatMessage(error.fillInValidInput))
    }
  }

  const DEBOUNCE_INTERVAL = 300

  return (
    <Box>
      <Text variant="h2" marginBottom={1}>
        {formatMessage(information.labels.operator.title)}
      </Text>
      <Text marginBottom={5}>
        {formatMessage(information.labels.operator.description)}
      </Text>
      <Box position="relative" marginTop={3}>
        <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
          <Text variant="h5">
            {formatMessage(information.labels.operator.title)}
          </Text>
          {buyerOperator?.nationalId &&
            buyerOperator?.nationalId?.trim() !== '' && (
              <Button variant="text" onClick={handleClear}>
                {formatMessage(information.labels.operator.remove)}
              </Button>
            )}
        </Box>
        <NationalIdWithName
          {...props}
          id="buyerOperator"
          customNameLabel={formatMessage(information.labels.operator.name)}
          customNationalIdLabel={formatMessage(
            information.labels.operator.nationalId,
          )}
          onNationalIdChange={setNationalId}
          nationalIdDefaultValue={nationalId || ''}
          onNameChange={setName}
          nameDefaultValue={name || ''}
          searchCompanies={true}
        />
        <GridRow>
          <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
            <InputController
              id={'email'}
              name={'email'}
              type="email"
              label={formatMessage(information.labels.operator.email)}
              error={
                errorMessage && email?.length === 0 ? errorMessage : undefined
              }
              backgroundColor="blue"
              required
              defaultValue={email || ''}
              onChange={debounce(
                (event) => setEmail(event.target.value),
                DEBOUNCE_INTERVAL,
              )}
            />
          </GridColumn>
          <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
            <InputController
              id={'phone'}
              name={'phone'}
              type="tel"
              format="###-####"
              label={formatMessage(information.labels.operator.phone)}
              error={
                errorMessage && phone?.length === 0 ? errorMessage : undefined
              }
              backgroundColor="blue"
              required
              defaultValue={phone || ''}
              onChange={debounce(
                (event) => setPhone(event.target.value),
                DEBOUNCE_INTERVAL,
              )}
            />
          </GridColumn>
        </GridRow>
      </Box>
      {genericErrorMessage && (
        <Text variant="eyebrow" color="red600">
          {genericErrorMessage}
        </Text>
      )}
      <Box style={{ marginTop: '40vh' }}>
        <Divider />
        <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
          <Button variant="ghost" onClick={onBackButtonClick}>
            {formatMessage(review.buttons.back)}
          </Button>
          <Button icon="arrowForward" onClick={onForwardButtonClick}>
            {formatMessage(information.labels.buyerOperators.approveButton)}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default ReviewOperatorRepeater
