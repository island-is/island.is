import { gql, useLazyQuery } from '@apollo/client'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { GET_OPERATOR_INFO } from '../../graphql/queries'
import { OldOperatorInformation } from '../../shared'
import { OldOperatorItem } from './OldOperatorItem'

export const OldOperators: FC<FieldBaseProps> = (props) => {
  const { application, setFieldLoadingState } = props
  const { setValue } = useFormContext()
  const [oldOperators, setOldOperators] = useState<OldOperatorInformation[]>(
    getValueViaPath(
      application.answers,
      'oldOperators',
      [],
    ) as OldOperatorInformation[],
  )

  const [getOperatorInfo, { loading }] = useLazyQuery(
    gql`
      ${GET_OPERATOR_INFO}
    `,
    {
      onCompleted: (result) => {
        const data = result.vehiclesDetail
        if (data !== oldOperators) {
          setOldOperators(data?.operators || [])
        }
        if (data?.operators?.length === 0) {
          setValue('oldOperators', [])
        }
      },
    },
  )

  const handleRemoveOld = (index: number) => {
    const operators = oldOperators.map((operator, oldIndex) => {
      if (index === oldIndex) {
        const newOperatorValue = {
          name: operator.name,
          nationalId: operator.nationalId,
          wasRemoved: 'true',
          startDate: operator.startDate,
        }
        return newOperatorValue
      }
      return operator
    })
    setOldOperators(operators)
  }

  useEffect(() => {
    setFieldLoadingState?.(loading)
  }, [loading])

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

  return (
    <Box>
      {oldOperators.map((operator: OldOperatorInformation, index: number) => {
        return (
          <OldOperatorItem
            id="oldOperators"
            repeaterField={operator}
            index={index}
            rowLocation={index + 1}
            key={`old-operator-${index}`}
            handleRemove={handleRemoveOld}
            {...props}
          />
        )
      })}
    </Box>
  )
}
