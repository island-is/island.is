import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState, useCallback, useEffect } from 'react'
import { information } from '../../lib/messages'
import { CoOwnerAndOperator, UserInformation } from '../../shared'
import { BuyerItem } from './BuyerItem'
import { repeaterButtons } from './CoOwnerAndOperatorRepeater.css'
import { CoOwnerAndOperatorRepeaterItem } from './CoOwnerAndOperatorRepeaterItem'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

export const CoOwnerAndOperatorRepeater: FC<FieldBaseProps> = (props) => {
  const { locale, formatMessage } = useLocale()
  const { application, setBeforeSubmitCallback } = props
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [buyer, setBuyer] = useState<UserInformation>(
    getValueViaPath(application.answers, 'buyer', {
      name: '',
      nationalId: '',
      phone: '',
      email: '',
    }) as UserInformation,
  )
  const [buyerCoOwnerAndOperator, setBuyerCoOwnerAndOperator] = useState<
    CoOwnerAndOperator[]
  >(
    getValueViaPath(
      application.answers,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[],
  )

  const updateBuyer = useCallback(async (buyer: UserInformation) => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            buyer: buyer,
          },
        },
        locale,
      },
    })
  }, [])

  const handleAdd = (type: 'operator' | 'coOwner') =>
    setBuyerCoOwnerAndOperator([
      ...buyerCoOwnerAndOperator,
      {
        name: '',
        nationalId: '',
        email: '',
        phone: '',
        type,
      },
    ])

  const handleRemove = (position: number) => {
    if (position > -1) {
      setBuyerCoOwnerAndOperator(
        buyerCoOwnerAndOperator.map((coOwnerAndOperator, index) => {
          if (index === position) {
            return { ...coOwnerAndOperator, wasRemoved: 'true' }
          }
          return coOwnerAndOperator
        }),
      )
    }
  }
  const filteredCoOwnersAndOperators = buyerCoOwnerAndOperator.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )
  const allOperators = filteredCoOwnersAndOperators.filter(
    (field) => field.type === 'operator',
  )
  const allCoOwners = filteredCoOwnersAndOperators.filter(
    (field) => field.type === 'coOwner',
  )

  useEffect(() => {
    if (
      buyer.name.length > 0 &&
      buyer.nationalId.length === 10 &&
      buyer.phone.length === 7 &&
      buyer.email.length > 0
    ) {
      updateBuyer(buyer)
    }
  }, [buyer])

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      console.log('hello here')
      return [true, null]
    })

  return (
    <Box>
      <BuyerItem id="buyer" buyer={buyer} setBuyer={setBuyer} {...props} />
      {buyerCoOwnerAndOperator.map((field, index) => {
        const rowLocation =
          field.type === 'operator'
            ? allOperators.indexOf(field)
            : allCoOwners.indexOf(field)
        return (
          <CoOwnerAndOperatorRepeaterItem
            id="buyerCoOwnerAndOperator"
            repeaterField={field}
            index={index}
            rowLocation={rowLocation + 1}
            key={`buyerCoOwnerAndOperator-${index}`}
            handleRemove={handleRemove}
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
  )
}
