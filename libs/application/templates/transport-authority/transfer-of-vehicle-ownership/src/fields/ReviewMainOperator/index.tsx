import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { error, information, review } from '../../lib/messages'
import { ReviewScreenProps } from '../../shared'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { RadioController } from '@island.is/shared/form-fields'
import kennitala from 'kennitala'

export const ReviewMainOperator: FC<
  React.PropsWithChildren<FieldBaseProps & ReviewScreenProps>
> = ({
  setStep,
  coOwnersAndOperators = [],
  setMainOperator,
  mainOperator = '',
  ...props
}) => {
  const { application } = props
  const { locale, formatMessage } = useLocale()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )
  const [genericErrorMessage, setGenericErrorMessage] = useState<
    string | undefined
  >(undefined)
  const [tempMainOperator, setTempMainOperator] = useState<string>(mainOperator)

  const filteredCoOwnersAndOperators = coOwnersAndOperators.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )
  const allOperators = filteredCoOwnersAndOperators.filter(
    (field) => field.type === 'operator',
  )

  const onBackButtonClick = () => {
    setErrorMessage(undefined)
    setGenericErrorMessage(undefined)
    setStep && setStep('addPeople')
  }

  const onForwardButtonClick = async () => {
    if (setMainOperator) {
      if (tempMainOperator.length === 0) {
        setGenericErrorMessage(undefined)
        setErrorMessage(formatMessage(error.fillInValidInput))
      } else {
        const res = await updateApplication({
          variables: {
            input: {
              id: application.id,
              answers: {
                buyerMainOperator: {
                  nationalId: tempMainOperator,
                },
              },
            },
            locale,
          },
        })
        if (!res.data) {
          setGenericErrorMessage(formatMessage(error.couldNotUpdateApplication))
        } else {
          setMainOperator(tempMainOperator)
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
        {formatMessage(information.labels.mainOperator.title)}
      </Text>
      <Text marginBottom={5}>
        {formatMessage(information.labels.mainOperator.description)}
      </Text>
      <Box>
        <RadioController
          id="buyerMainOperator.nationalId"
          defaultValue={mainOperator || undefined}
          onSelect={(value) => setTempMainOperator(value)}
          options={allOperators.map((operator) => {
            return {
              value: operator.nationalId!,
              label: `${operator.name} - ${kennitala.format(
                operator.nationalId!,
              )}`,
            }
          })}
        />
      </Box>
      {genericErrorMessage && (
        <Text variant="eyebrow" color="red600">
          {genericErrorMessage}
        </Text>
      )}
      {errorMessage && (
        <Text variant="eyebrow" color="red600">
          {errorMessage}
        </Text>
      )}
      <Box style={{ marginTop: '40vh' }}>
        <Divider />
        <Box display="flex" justifyContent="spaceBetween" paddingY={5}>
          <Button variant="ghost" onClick={onBackButtonClick}>
            {formatMessage(review.buttons.back)}
          </Button>
          <Button icon="arrowForward" onClick={onForwardButtonClick}>
            {formatMessage(
              information.labels.coOwnersAndOperators.approveButton,
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
