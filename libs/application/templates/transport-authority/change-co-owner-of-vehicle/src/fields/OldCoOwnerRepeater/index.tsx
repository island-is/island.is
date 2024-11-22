import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { OwnerCoOwnersInformation } from '../../shared'
import { getValueViaPath } from '@island.is/application/core'
import { OldCoOwnerRepeaterItem } from './OldCoOwnerRepeaterItem'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

export const OldCoOwnerRepeater: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field } = props
  const { locale } = useLocale()
  const { setValue } = useFormContext()
  const { id } = field

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

  const [ownerCoOwners, setOwnerCoOwners] = useState<
    OwnerCoOwnersInformation[]
  >(
    getValueViaPath<OwnerCoOwnersInformation[]>(
      application.answers,
      'ownerCoOwners',
      [],
    ) || [],
  )

  const filteredOwnerCoOwners = ownerCoOwners.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )

  const updateData = useCallback(
    async (position: number) => {
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              ownerCoOwners: ownerCoOwners.map((coOwner, index) => {
                if (index === position) {
                  return { ...coOwner, wasRemoved: 'true' }
                } else {
                  return coOwner
                }
              }),
            },
          },
          locale,
        },
      })
    },
    [application.id, locale, ownerCoOwners, updateApplication],
  )

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
      updateData(position)
    }
  }

  return (
    <Box>
      {ownerCoOwners.length > 0 &&
        ownerCoOwners.map((coOwner, index) => (
          <OldCoOwnerRepeaterItem
            id={id}
            index={index}
            rowLocation={
              filteredOwnerCoOwners.indexOf(coOwner) > -1
                ? filteredOwnerCoOwners.indexOf(coOwner) + 1
                : index + 1
            }
            key={`ownerCoOwners-${index}`}
            handleRemove={handleRemoveOld}
            wasRemoved={coOwner.wasRemoved === 'true'}
            {...props}
          />
        ))}
    </Box>
  )
}
