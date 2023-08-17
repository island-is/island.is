import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { information } from '../../lib/messages'
import { OwnerCoOwnersInformation, CoOwnersInformation } from '../../shared'
import { CoOwnerRepeaterItem } from './CoOwnerRepeaterItem'
import { getValueViaPath } from '@island.is/application/core'
import { OwnerCoOwners } from './OwnerCoOwners'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'

export const CoOwnerRepeater: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, setBeforeSubmitCallback } = props
  const { locale, formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [ownerCoOwners, setOwnerCoOwners] = useState<
    OwnerCoOwnersInformation[]
  >(
    getValueViaPath(
      application.answers,
      'ownerCoOwners',
      [],
    ) as OwnerCoOwnersInformation[],
  )
  const [coOwners, setCoOwners] = useState<CoOwnersInformation[]>(
    getValueViaPath(
      application.answers,
      'coOwners',
      [],
    ) as CoOwnersInformation[],
  )
  const [identicalError, setIdenticalError] = useState<boolean>(false)
  const filteredCoOwners = coOwners.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )
  const filteredOwnerCoOwners = ownerCoOwners.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )

  const updateData = useCallback(async (position: number) => {
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
  }, [])

  const addNationalIdToCoOwners = (nationalId: string, newIndex: number) => {
    setCoOwners(
      coOwners.map((coOwner, index) => {
        if (newIndex === index) {
          return {
            ...coOwner,
            nationalId,
          }
        }
        return coOwner
      }),
    )
  }

  const checkDuplicate = () => {
    const existingOwnerCoOwners = filteredOwnerCoOwners.map(
      ({ nationalId }) => {
        return nationalId
      },
    )
    const existingCoOwners = filteredCoOwners.map(({ nationalId }) => {
      return nationalId
    })
    const jointCoOwners = [
      ...existingOwnerCoOwners,
      ...existingCoOwners,
      application.applicant,
    ]
    return !!jointCoOwners.some((nationalId, index) => {
      return (
        nationalId &&
        nationalId.length > 0 &&
        jointCoOwners.indexOf(nationalId) !== index
      )
    })
  }

  const handleAdd = () => {
    const newCoOwner = {
      name: '',
      nationalId: '',
      email: '',
      phone: '',
    }
    setCoOwners([...coOwners, newCoOwner])
  }

  const handleRemove = (position: number) => {
    if (position > -1) {
      setCoOwners(
        coOwners.map((coOwner, index) => {
          if (index === position) {
            return { ...coOwner, wasRemoved: 'true' }
          }
          return coOwner
        }),
      )
    }
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
      updateData(position)
    }
  }

  useEffect(() => {
    if (coOwners.length === 0) {
      setValue('coOwners', [])
    }
  }, [coOwners, setValue])

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
      {ownerCoOwners.length > 0 &&
        ownerCoOwners.map((coOwner, index) => (
          <OwnerCoOwners
            id="ownerCoOwners"
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
      {coOwners.length > 0 ? (
        coOwners.map((coOwner, index) => {
          return (
            <CoOwnerRepeaterItem
              id="coOwners"
              repeaterField={coOwner}
              index={index}
              rowLocation={
                filteredCoOwners.indexOf(coOwner) > -1
                  ? filteredCoOwners.indexOf(coOwner) + 1
                  : index + 1
              }
              key={`coOwner-${index}`}
              handleRemove={handleRemove}
              addNationalIdToCoOwners={addNationalIdToCoOwners}
              {...props}
            />
          )
        })
      ) : (
        <Text variant="h5" marginBottom={2}>
          {formatMessage(information.labels.coOwner.coOwnerTempTitle)}
        </Text>
      )}
      <Button variant="ghost" icon="add" iconType="outline" onClick={handleAdd}>
        {formatMessage(information.labels.coOwner.add)}
      </Button>
      {identicalError && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(information.labels.coOwner.identicalError)}
          />
        </Box>
      )}
    </Box>
  )
}
