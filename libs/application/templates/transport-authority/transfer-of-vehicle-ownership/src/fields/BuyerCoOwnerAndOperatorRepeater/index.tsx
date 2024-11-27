import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { information } from '../../lib/messages'
import { CoOwnerAndOperator } from '../../shared'
import { repeaterButtons } from './BuyerCoOwnerAndOperatorRepeater.css'
import { BuyerCoOwnerAndOperatorRepeaterItem } from './BuyerCoOwnerAndOperatorRepeaterItem'
import { useFormContext } from 'react-hook-form'

export const BuyerCoOwnerAndOperatorRepeater: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { formatMessage } = useLocale()
  const { application, field, setBeforeSubmitCallback } = props
  const { id } = field
  const { watch } = useFormContext()

  const [identicalError, setIdenticalError] = useState<boolean>(false)

  const [buyerCoOwnerAndOperator, setBuyerCoOwnerAndOperator] = useState<
    CoOwnerAndOperator[]
  >(
    getValueViaPath(
      application.answers,
      'buyerCoOwnerAndOperator',
      [],
    ) as CoOwnerAndOperator[],
  )

  const filteredCoOwnersAndOperators = buyerCoOwnerAndOperator.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )
  const allOperators = filteredCoOwnersAndOperators.filter(
    (field) => field.type === 'operator',
  )
  const allCoOwners = filteredCoOwnersAndOperators.filter(
    (field) => field.type === 'coOwner',
  )

  const addNationalIdToCoOwners = (nationalId: string, newIndex: number) => {
    setBuyerCoOwnerAndOperator(
      buyerCoOwnerAndOperator.map((coOwnerOrOperator, index) => {
        if (newIndex === index) {
          return {
            ...coOwnerOrOperator,
            nationalId,
          }
        }
        return coOwnerOrOperator
      }),
    )
  }

  const checkDuplicate = async () => {
    const existingCoOwnersAndOperators = filteredCoOwnersAndOperators.map(
      ({ nationalId }) => {
        return nationalId
      },
    )

    const buyerNationalId = watch('buyer.nationalId')

    const jointOperators = [...existingCoOwnersAndOperators, buyerNationalId]
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
        needsAgeValidation: type === 'operator' ? false : true,
        type,
      },
    ])

  const handleRemove = (position: number) => {
    if (position > -1) {
      setBuyerCoOwnerAndOperator(
        buyerCoOwnerAndOperator.map((coOwnerOrOperator, index) => {
          if (index === position) {
            return { ...coOwnerOrOperator, wasRemoved: 'true' }
          }
          return coOwnerOrOperator
        }),
      )
    }
  }

  setBeforeSubmitCallback?.(async () => {
    const hasDuplicate = await checkDuplicate()
    setIdenticalError(hasDuplicate)
    if (hasDuplicate) {
      return [false, 'Identical nationalIds']
    }
    return [true, null]
  })

  return (
    <Box>
      {buyerCoOwnerAndOperator.map((field, index) => {
        const rowLocation =
          field.type === 'operator'
            ? allOperators.indexOf(field)
            : allCoOwners.indexOf(field)
        return (
          <BuyerCoOwnerAndOperatorRepeaterItem
            id={id}
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
      {identicalError && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(information.labels.operator.identicalError)}
          />
        </Box>
      )}
    </Box>
  )
}
