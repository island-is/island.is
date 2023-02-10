import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { error, information, review } from '../../lib/messages'
import { ReviewCoOwnerAndOperatorField, ReviewScreenProps } from '../../shared'
import { ReviewCoOwnerAndOperatorRepeaterItem } from './ReviewCoOwnerAndOperatorRepeaterItem'
import { repeaterButtons } from './ReviewCoOwnerAndOperatorRepeater.css'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

export const ReviewCoOwnerAndOperatorRepeater: FC<
  FieldBaseProps & ReviewScreenProps
> = ({
  setStep,
  setCoOwnersAndOperators,
  coOwnersAndOperators = [],
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
  const [tempCoOwnersAndOperators, setTempCoOwnersAndOperators] = useState<
    ReviewCoOwnerAndOperatorField[]
  >(coOwnersAndOperators)

  const handleAdd = (type: 'operator' | 'coOwner') =>
    setTempCoOwnersAndOperators([
      ...tempCoOwnersAndOperators,
      {
        name: '',
        nationalId: '',
        email: '',
        phone: '',
        type,
      },
    ])

  const handleRemove = (index: number) => {
    if (index > -1) {
      const temp = [...tempCoOwnersAndOperators]
      temp.splice(index, 1)
      setTempCoOwnersAndOperators(temp)
    }
  }

  const allOperators = tempCoOwnersAndOperators.filter(
    (field) => field.type === 'operator',
  )
  const allCoOwners = tempCoOwnersAndOperators.filter(
    (field) => field.type === 'coOwner',
  )

  const onBackButtonClick = () => {
    setErrorMessage(undefined)
    setGenericErrorMessage(undefined)
    setStep && setStep('overview')
  }

  const onForwardButtonClick = async () => {
    if (tempCoOwnersAndOperators && setCoOwnersAndOperators) {
      const notValid = tempCoOwnersAndOperators.find((field) => {
        if (
          field.email.length === 0 ||
          field.name.length === 0 ||
          field.nationalId.length === 0 ||
          field.phone.length === 0
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
                buyerCoOwnerAndOperator: tempCoOwnersAndOperators,
              },
            },
            locale,
          },
        })
        if (!res.data) {
          setGenericErrorMessage(formatMessage(error.couldNotUpdateApplication))
        } else {
          setCoOwnersAndOperators(tempCoOwnersAndOperators)
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
        {formatMessage(information.labels.coOwnersAndOperators.title)}
      </Text>
      <Text marginBottom={5}>
        {formatMessage(information.labels.coOwnersAndOperators.description)}
      </Text>
      <Box>
        {tempCoOwnersAndOperators?.map((field, index) => {
          const rowLocation =
            field.type === 'operator'
              ? allOperators.indexOf(field)
              : allCoOwners.indexOf(field)
          return (
            <ReviewCoOwnerAndOperatorRepeaterItem
              id="buyerCoOwnerAndOperator"
              repeaterField={field}
              index={index}
              rowLocation={rowLocation + 1}
              key={`${index}-buyerCoOwnerAndOperator`}
              handleRemove={handleRemove}
              setCoOwnersAndOperators={setTempCoOwnersAndOperators}
              coOwnersAndOperators={tempCoOwnersAndOperators}
              errorMessage={errorMessage}
              {...props}
            />
          )
        })}
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
            onClick={handleAdd.bind(null, 'coOwner')}
          >
            {formatMessage(information.labels.coOwner.add)}
          </Button>
          <Button
            variant="ghost"
            icon="add"
            iconType="outline"
            onClick={handleAdd.bind(null, 'operator')}
          >
            {formatMessage(information.labels.operator.add)}
          </Button>
        </Box>
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
            {formatMessage(
              information.labels.coOwnersAndOperators.approveButton,
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
