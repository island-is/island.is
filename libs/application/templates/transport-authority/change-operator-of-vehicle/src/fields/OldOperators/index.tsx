import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC, useState } from 'react'
import { OldOperatorInformation } from '../../shared'
import { OldOperatorItem } from './OldOperatorItem'

export const OldOperators: FC<FieldBaseProps> = (props) => {
  const { application } = props
  const [oldOperators, setOldOperators] = useState<OldOperatorInformation[]>(
    getValueViaPath(
      application.answers,
      'oldOperators',
      [],
    ) as OldOperatorInformation[],
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
