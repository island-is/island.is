import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  Divider,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { error, information, review } from '../../lib/messages'
import { Operator, ReviewScreenProps } from '../../shared'
import { ReviewOperatorRepeaterItem } from './ReviewOperatorRepeaterItem'
import { repeaterButtons } from './ReviewOperatorRepeater.css'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { getValueViaPath } from '@island.is/application/core'

export const ReviewOperatorRepeater: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({ setStep, setBuyerOperator, buyerOperator = {}, ...props }) => {
  const { application } = props

  const { locale, formatMessage } = useLocale()

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )

  const [genericErrorMessage, setGenericErrorMessage] = useState<
    string | undefined
  >(undefined)

  const [tempBuyerOperator, setTempBuyerOperator] = useState<
    Operator | undefined
  >(buyerOperator || undefined)

  const operator =
    tempBuyerOperator?.wasRemoved !== 'true' ? tempBuyerOperator : undefined

  const handleAdd = () =>
    setTempBuyerOperator({
      name: '',
      nationalId: '',
      email: '',
      phone: '',
    })

  const handleRemove = () => {
    setTempBuyerOperator({
      ...tempBuyerOperator,
      wasRemoved: 'true',
    })
  }

  const onBackButtonClick = () => {
    setErrorMessage(undefined)
    setGenericErrorMessage(undefined)
    setStep && setStep('overview')
  }

  const onForwardButtonClick = async () => {
    if (tempBuyerOperator && setBuyerOperator) {
      const notValid =
        !(tempBuyerOperator.email && tempBuyerOperator.email.length > 0) ||
        !(tempBuyerOperator.name && tempBuyerOperator.name.length > 0) ||
        !(
          tempBuyerOperator.nationalId &&
          tempBuyerOperator.nationalId.length > 0
        ) ||
        !(tempBuyerOperator.phone && tempBuyerOperator.phone.length > 0)

      if (notValid) {
        setGenericErrorMessage(undefined)
        setErrorMessage(formatMessage(error.fillInValidInput))
      } else {
        const res = await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                buyerOperator: tempBuyerOperator,
              },
            },
            locale,
          },
        })

        if (!res.data) {
          setGenericErrorMessage(formatMessage(error.couldNotUpdateApplication))
        } else {
          setBuyerOperator(tempBuyerOperator)
          setGenericErrorMessage(undefined)
          setErrorMessage(undefined)
          setStep && setStep('overview')
        }
      }
    }
  }

  return (
    <Box>
      <Text variant="h2" marginBottom={1}>
        {formatMessage(information.labels.buyerOperators.title)}
      </Text>
      <Text marginBottom={5}>
        {formatMessage(information.labels.buyerOperators.description)}
      </Text>
      <Box>
        <ReviewOperatorRepeaterItem
          id="buyerOperator"
          repeaterField={tempBuyerOperator || {}}
          index={0} // Assuming it's the first (or only) buyerOperator
          key={`0-buyerOperator`}
          handleRemove={handleRemove}
          setBuyerOperator={setTempBuyerOperator}
          buyerOperator={tempBuyerOperator}
          errorMessage={errorMessage}
          {...props}
        />
        {!tempBuyerOperator || Object.keys(tempBuyerOperator).length === 0 ? (
          <Box
            display="flex"
            alignItems="stretch"
            flexDirection="row"
            className={repeaterButtons}
            marginTop={3}
          >
            <Button
              variant="ghost"
              icon="add"
              iconType="outline"
              onClick={handleAdd}
            >
              {formatMessage(information.labels.operator.add)}
            </Button>
          </Box>
        ) : null}
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
