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
> = ({ setStep, setBuyerOperators, buyerOperators = [], ...props }) => {
  const { application } = props

  const { locale, formatMessage } = useLocale()

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )

  const [genericErrorMessage, setGenericErrorMessage] = useState<
    string | undefined
  >(undefined)

  const [identicalError, setIdenticalError] = useState<boolean>(false)

  const [tempBuyerOperators, setTempBuyerOperators] =
    useState<Operator[]>(buyerOperators)

  const filteredBuyerOperators = tempBuyerOperators.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )
  const allOperators = filteredBuyerOperators

  const checkDuplicate = () => {
    const existingBuyerOperators = filteredBuyerOperators.map(
      ({ nationalId }) => {
        return nationalId
      },
    )

    const buyerNationalId = getValueViaPath(
      application.answers,
      'buyer.nationalId',
    ) as string

    const jointOperators = [...existingBuyerOperators, buyerNationalId]
    return !!jointOperators.some((nationalId, index) => {
      return (
        nationalId &&
        nationalId.length > 0 &&
        jointOperators.indexOf(nationalId) !== index
      )
    })
  }

  const handleAdd = () =>
    setTempBuyerOperators([
      ...tempBuyerOperators,
      {
        name: '',
        nationalId: '',
        email: '',
        phone: '',
      },
    ])

  const handleRemove = (position: number) => {
    if (position > -1) {
      setTempBuyerOperators(
        tempBuyerOperators.map((buyerOperator, index) => {
          if (index === position) {
            return { ...buyerOperator, wasRemoved: 'true' }
          }
          return buyerOperator
        }),
      )
    }
  }

  const onBackButtonClick = () => {
    setErrorMessage(undefined)
    setGenericErrorMessage(undefined)
    setStep && setStep('overview')
  }

  const shouldUpdateMainOperator = () => {
    const availableOperators = tempBuyerOperators.filter(({ wasRemoved }) => {
      return wasRemoved !== 'true'
    })
    return availableOperators.length > 1
  }

  const onForwardButtonClick = async () => {
    setIdenticalError(checkDuplicate())
    if (!checkDuplicate()) {
      setIdenticalError(false)
      if (tempBuyerOperators && setBuyerOperators) {
        const notValid = filteredBuyerOperators.find((field) => {
          if (
            !(field.email && field.email.length > 0) ||
            !(field.name && field.name.length > 0) ||
            !(field.nationalId && field.nationalId.length > 0) ||
            !(field.phone && field.phone.length > 0)
          ) {
            return true
          }
          return false
        })
        if (notValid) {
          setGenericErrorMessage(undefined)
          setErrorMessage(formatMessage(error.fillInValidInput))
        } else {
          const res = await updateApplication({
            variables: {
              input: {
                id: application.id,
                answers: {
                  buyerOperator: tempBuyerOperators,
                },
              },
              locale,
            },
          })
          if (!res.data) {
            setGenericErrorMessage(
              formatMessage(error.couldNotUpdateApplication),
            )
          } else {
            setBuyerOperators(tempBuyerOperators)
            setGenericErrorMessage(undefined)
            setErrorMessage(undefined)
            setStep &&
              setStep(shouldUpdateMainOperator() ? 'mainOperator' : 'overview')
          }
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
        {tempBuyerOperators?.map((field, index) => {
          const rowLocation = allOperators.indexOf(field)
          return (
            <ReviewOperatorRepeaterItem
              id="buyerOperator"
              repeaterField={field}
              index={index}
              rowLocation={rowLocation + 1}
              key={`${index}-buyerOperator`}
              handleRemove={handleRemove}
              setBuyerOperators={setTempBuyerOperators}
              buyerOperators={tempBuyerOperators}
              errorMessage={errorMessage}
              {...props}
            />
          )
        })}
        {tempBuyerOperators.length === 0 || allOperators.length === 0 ? (
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
      {identicalError && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(information.labels.operator.identicalError)}
          />
        </Box>
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
