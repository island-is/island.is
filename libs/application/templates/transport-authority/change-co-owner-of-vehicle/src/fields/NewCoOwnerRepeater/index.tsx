import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { information } from '../../lib/messages'
import { CoOwnersInformation, OwnerCoOwnersInformation } from '../../shared'
import { NewCoOwnerRepeaterItem } from './NewCoOwnerRepeaterItem'
import { getValueViaPath } from '@island.is/application/core'
import { useLazyQuery } from '@apollo/client'
import { APPLICATION_APPLICATION } from '@island.is/application/graphql'

export const NewCoOwnerRepeater: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field, setBeforeSubmitCallback } = props
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { id } = field

  const [identicalError, setIdenticalError] = useState<boolean>(false)
  const [noCoOwnerChangesError, setNoCoOwnerChangesError] =
    useState<boolean>(false)

  const [getApplicationInfo] = useLazyQuery(APPLICATION_APPLICATION, {
    onError: (e) => {
      console.error(e, e.message)
      return
    },
  })

  const [coOwners, setCoOwners] = useState<CoOwnersInformation[]>(
    getValueViaPath<CoOwnersInformation[]>(
      application.answers,
      'coOwners',
      [],
    ) || [],
  )

  const filteredCoOwners = coOwners.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )

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

  const getOldCoOwners = async () => {
    // Get updated ownerCoOwners from answers
    const applicationInfo = await getApplicationInfo({
      variables: {
        input: {
          id: application.id,
        },
        locale: 'is',
      },
      fetchPolicy: 'no-cache',
    })
    const updatedApplication = applicationInfo?.data?.applicationApplication

    const oldCoOwners =
      getValueViaPath<OwnerCoOwnersInformation[]>(
        updatedApplication.answers,
        'ownerCoOwners',
        [],
      ) || []

    const filteredOldCoOwners = oldCoOwners.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )

    return filteredOldCoOwners
  }

  const checkDuplicate = async () => {
    const oldCoOwnerNationalIds = (await getOldCoOwners()).map(
      ({ nationalId }) => nationalId,
    )

    const newCoOwnerNationalIds = filteredCoOwners.map(
      ({ nationalId }) => nationalId,
    )
    const jointCoOwners = [
      ...oldCoOwnerNationalIds,
      ...newCoOwnerNationalIds,
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

  useEffect(() => {
    if (coOwners.length === 0) {
      setValue('coOwners', [])
    }
  }, [coOwners, setValue])

  setBeforeSubmitCallback?.(async () => {
    setIdenticalError(false)
    setNoCoOwnerChangesError(false)

    const hasDuplicate = await checkDuplicate()
    if (hasDuplicate) {
      setIdenticalError(true)
      return [false, 'Identical nationalIds']
    }

    const coOwnerWasAdded =
      coOwners?.filter(({ wasRemoved }) => wasRemoved !== 'true').length > 0
    const oldCoOwners = await getOldCoOwners()
    const coOwnerWasRemoved = !!oldCoOwners?.find(
      (x) => x.wasRemoved === 'true',
    )
    const noCoOwnerChanges = !coOwnerWasAdded && !coOwnerWasRemoved
    if (noCoOwnerChanges) {
      setNoCoOwnerChangesError(true)
      return [false, 'No co-owner has been added/removed']
    }

    return [true, null]
  })

  return (
    <Box>
      {coOwners.length > 0 ? (
        coOwners.map((coOwner, index) => {
          return (
            <NewCoOwnerRepeaterItem
              id={id}
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
      {noCoOwnerChangesError && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(information.labels.coOwner.noChangesError)}
          />
        </Box>
      )}
    </Box>
  )
}
