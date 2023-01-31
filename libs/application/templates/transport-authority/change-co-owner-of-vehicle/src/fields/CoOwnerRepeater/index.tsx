import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { information } from '../../lib/messages'
import { OwnerCoOwnersInformation, UserInformation } from '../../shared'
import { CoOwnerRepeaterItem } from './CoOwnerRepeaterItem'
import { getValueViaPath } from '@island.is/application/core'
import { OwnerCoOwners } from './OwnerCoOwners'

export const CoOwnerRepeater: FC<FieldBaseProps> = (props) => {
  const { application } = props
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray<UserInformation>({
    name: 'coOwners',
  })
  const [ownerCoOwners, setOwnerCoOwners] = useState<
    OwnerCoOwnersInformation[]
  >(
    getValueViaPath(
      application.answers,
      'ownerCoOwners',
      [],
    ) as OwnerCoOwnersInformation[],
  )

  const handleAdd = (operator?: UserInformation) =>
    append({
      name: operator?.name || '',
      nationalId: operator?.nationalId || '',
      email: operator?.email || '',
      phone: operator?.phone || '',
    })

  const handleRemove = (index: number) => {
    remove(index)
  }

  const handleRemoveOld = (position: number) => {
    if (ownerCoOwners.length >= position) {
      setValue(`ownerCoOwners[${position}].wasRemoved`, 'true')
      setOwnerCoOwners(
        ownerCoOwners.map((coOwner, index) => {
          if (index === position) {
            return { ...coOwner, wasRemoved: 'true' }
          } else {
            return coOwner
          }
        }),
      )
    }
  }

  useEffect(() => {
    if (fields.length === 0) {
      setValue('coOwners', [])
    }
  }, [fields, setValue])

  return (
    <Box>
      {ownerCoOwners.length > 0 &&
        ownerCoOwners.map((coOwner, index) =>
          coOwner.wasRemoved ? null : (
            <OwnerCoOwners
              id="ownerCoOwners"
              index={index}
              rowLocation={index + 1}
              key={`ownerCoOwners-${index}`}
              handleRemove={handleRemoveOld}
              {...props}
            />
          ),
        )}
      {fields.length > 0 ? (
        fields.map((field, index) => {
          return (
            <CoOwnerRepeaterItem
              id="coOwners"
              repeaterField={field}
              index={index}
              rowLocation={index + 1}
              key={field.id}
              handleRemove={handleRemove}
              {...props}
            />
          )
        })
      ) : (
        <Text variant="h5" marginBottom={2}>
          {formatMessage(information.labels.coOwner.coOwnerTempTitle)}
        </Text>
      )}
      <Button
        variant="ghost"
        icon="add"
        iconType="outline"
        onClick={handleAdd.bind(null, undefined)}
      >
        {formatMessage(information.labels.coOwner.add)}
      </Button>
    </Box>
  )
}
