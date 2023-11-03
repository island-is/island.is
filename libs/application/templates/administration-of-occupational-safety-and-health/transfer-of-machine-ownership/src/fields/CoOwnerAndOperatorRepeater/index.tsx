import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState, useCallback, useEffect } from 'react'
import { information } from '../../lib/messages'
import { CoOwnerAndOperator, UserInformation } from '../../shared'
import { BuyerItem } from './BuyerItem'
import { repeaterButtons } from './CoOwnerAndOperatorRepeater.css'
import { CoOwnerAndOperatorRepeaterItem } from './CoOwnerAndOperatorRepeaterItem'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i

export const CoOwnerAndOperatorRepeater: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
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
  const [identicalError, setIdenticalError] = useState<boolean>(false)

  const filteredCoOwnersAndOperators = buyerCoOwnerAndOperator.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )
  const allOperators = filteredCoOwnersAndOperators.filter(
    (field) => field.type === 'operator',
  )
  const allCoOwners = filteredCoOwnersAndOperators.filter(
    (field) => field.type === 'coOwner',
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

  const addNationalIdToCoOwners = (nationalId: string, newIndex: number) => {
    setBuyerCoOwnerAndOperator(
      buyerCoOwnerAndOperator.map((coOwnerOroperator, index) => {
        if (newIndex === index) {
          return {
            ...coOwnerOroperator,
            nationalId,
          }
        }
        return coOwnerOroperator
      }),
    )
  }

  const checkDuplicate = () => {
    const existingCoOwnersAndOperators = filteredCoOwnersAndOperators.map(
      ({ nationalId }) => {
        return nationalId
      },
    )

    const jointOperators = [...existingCoOwnersAndOperators, buyer.nationalId]
    return !!jointOperators.some((nationalId, index) => {
      return (
        nationalId &&
        nationalId.length > 0 &&
        jointOperators.indexOf(nationalId) !== index
      )
    })
  }

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
        buyerCoOwnerAndOperator.map((coOwnerOroperator, index) => {
          if (index === position) {
            return { ...coOwnerOroperator, wasRemoved: 'true' }
          }
          return coOwnerOroperator
        }),
      )
    }
  }

  useEffect(() => {
    if (
      buyer.name.length > 0 &&
      buyer.nationalId.length === 10 &&
      buyer.phone.length >= 7 &&
      emailRegex.test(buyer.email)
    ) {
      updateBuyer(buyer)
    }
  }, [buyer])

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      setIdenticalError(checkDuplicate())
      if (checkDuplicate()) {
        return [false, 'Identical nationalIds']
      }
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
            addNationalIdToCoOwners={addNationalIdToCoOwners}
            {...props}
          />
        )
      })}
      {/* <Box
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
      {identicalError && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(information.labels.operator.identicalError)}
          />
        </Box>
      )} */}
    </Box>
  )
}
