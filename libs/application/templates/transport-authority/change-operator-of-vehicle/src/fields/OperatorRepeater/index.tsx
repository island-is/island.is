import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { information } from '../../lib/messages'
import {
  OldOperatorInformation,
  OperatorInformation,
  UserInformation,
} from '../../shared'
import { OperatorRepeaterItem } from './OperatorRepeaterItem'
import { gql, useLazyQuery } from '@apollo/client'
import { GET_OPERATOR_INFO } from '../../graphql/queries'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { OldOperatorItem } from './OldOperatorItem'

export const OperatorRepeater: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, setFieldLoadingState, setBeforeSubmitCallback } = props
  const { locale, formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  const [operators, setOperators] = useState<OperatorInformation[]>(
    getValueViaPath(
      application.answers,
      'operators',
      [],
    ) as OperatorInformation[],
  )
  const [oldOperators, setOldOperators] = useState<OldOperatorInformation[]>(
    getValueViaPath(
      application.answers,
      'oldOperators',
      [],
    ) as OldOperatorInformation[],
  )
  const [identicalError, setIdenticalError] = useState<boolean>(false)

  const filteredOperators = operators.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )
  const filteredOldOperators = oldOperators.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )

  const updateDataByPosition = useCallback(async (position: number) => {
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            oldOperators: oldOperators.map((oldOperator, index) => {
              if (index === position) {
                return { ...oldOperator, wasRemoved: 'true' }
              } else {
                return oldOperator
              }
            }),
          },
        },
        locale,
      },
    })
  }, [])

  const updateData = useCallback(
    async (operators: OldOperatorInformation[]) => {
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: {
              oldOperators: operators,
            },
          },
          locale,
        },
      })
    },
    [],
  )

  const addNationalIdToCoOwners = (nationalId: string, newIndex: number) => {
    setOperators(
      operators.map((operator, index) => {
        if (newIndex === index) {
          return {
            ...operator,
            nationalId,
          }
        }
        return operator
      }),
    )
  }

  const checkDuplicate = () => {
    const existingOperators = filteredOperators.map(({ nationalId }) => {
      return nationalId
    })
    const existingOldOperators = filteredOldOperators.map(({ nationalId }) => {
      return nationalId
    })
    const coOwners = (
      getValueViaPath(
        application.answers,
        'ownerCoOwner',
        [],
      ) as UserInformation[]
    )?.map(({ nationalId }) => {
      return nationalId
    })

    const jointOperators = [
      ...existingOperators,
      ...existingOldOperators,
      ...coOwners,
      application.applicant,
    ]
    return !!jointOperators.some((nationalId, index) => {
      return (
        nationalId &&
        nationalId.length > 0 &&
        jointOperators.indexOf(nationalId) !== index
      )
    })
  }

  const [getOperatorInfo, { loading, error }] = useLazyQuery(
    gql`
      ${GET_OPERATOR_INFO}
    `,
    {
      onCompleted: (result) => {
        const data = result.vehiclesDetail
        if (data?.operators.length !== oldOperators.length) {
          setOldOperators(data?.operators || [])
          updateData(data?.operators || [])
        }
        if (data?.operators?.length === 0) {
          setValue('oldOperators', [])
        }
      },
    },
  )

  const handleAdd = () =>
    setOperators([
      ...operators,
      {
        name: '',
        nationalId: '',
        email: '',
        phone: '',
      },
    ])

  const handleRemove = (position: number) => {
    if (position > -1) {
      setOperators(
        operators.map((operator, index) => {
          if (index === position) {
            return { ...operator, wasRemoved: 'true' }
          }
          return operator
        }),
      )
    }
  }

  const handleRemoveOld = (index: number) => {
    if (index > -1) {
      setOldOperators(
        oldOperators.map((operator, oldIndex) => {
          if (oldIndex === index) {
            return { ...operator, wasRemoved: 'true' }
          }
          return operator
        }),
      )
      updateDataByPosition(index)
    }
  }

  useEffect(() => {
    setFieldLoadingState?.(loading || !!error)
  }, [loading, error])

  useEffect(() => {
    getOperatorInfo({
      variables: {
        input: {
          permno: getValueViaPath(
            application.answers,
            'pickVehicle.plate',
            undefined,
          ),
          regno: '',
          vin: '',
        },
      },
    })
  }, [oldOperators])

  useEffect(() => {
    if (operators.length === 0) {
      setValue('operators', [])
    }
  }, [operators, setValue])

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
      {!loading && !error ? (
        <Box>
          {oldOperators.map(
            (operator: OldOperatorInformation, index: number) => {
              return (
                <OldOperatorItem
                  id="oldOperators"
                  repeaterField={operator}
                  index={index}
                  rowLocation={
                    filteredOldOperators.indexOf(operator) > -1
                      ? filteredOldOperators.indexOf(operator) + 1
                      : index + 1
                  }
                  key={`old-operator-${index}`}
                  handleRemove={handleRemoveOld}
                  {...props}
                />
              )
            },
          )}
        </Box>
      ) : error ? (
        <Box marginTop={3}>
          <AlertMessage
            type="error"
            title={formatMessage(information.labels.operator.error)}
          />
        </Box>
      ) : null}
      {operators.length > 0 ? (
        operators.map((operator, index) => {
          return (
            <OperatorRepeaterItem
              id="operators"
              repeaterField={operator}
              index={index}
              rowLocation={
                filteredOperators.indexOf(operator) > -1
                  ? filteredOperators.indexOf(operator) + 1
                  : index + 1
              }
              key={`operator-${index}`}
              handleRemove={handleRemove}
              addNationalIdToCoOwners={addNationalIdToCoOwners}
              {...props}
            />
          )
        })
      ) : (
        <Text variant="h5" marginBottom={2}>
          {formatMessage(information.labels.operator.operatorTempTitle)}
        </Text>
      )}
      <Button variant="ghost" icon="add" iconType="outline" onClick={handleAdd}>
        {formatMessage(information.labels.operator.add)}
      </Button>
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
