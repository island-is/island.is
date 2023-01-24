import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { ChangeOperatorOfVehicle } from '../../lib/dataSchema'
import { error, information } from '../../lib/messages'
import { OperatorInformation } from '../../shared'
import { OperatorRepeaterItem } from './OperatorRepeaterItem'
import { OperatorField } from '../../types'

export const OperatorRepeater: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { setValue, setError } = useFormContext()
  const { fields, append, remove } = useFieldArray<OperatorInformation>({
    name: 'operators',
  })
  const { application } = props
  const answers = application.answers as ChangeOperatorOfVehicle

  const [tempNewOperators, setTempNewOperators] = useState<OperatorField[]>(
    answers.operators || [],
  )

  const handleAdd = (operator?: OperatorInformation) => {
    append({
      name: operator?.name || '',
      nationalId: operator?.nationalId || '',
      email: operator?.email || '',
      phone: operator?.phone || '',
    })

    setTempNewOperators([
      ...tempNewOperators,
      {
        nationalId: '',
      },
    ])
  }

  const handleRemove = (index: number) => {
    remove(index)

    if (index > -1) {
      const temp = [...tempNewOperators]
      temp.splice(index, 1)
      setTempNewOperators(temp)
    }
  }

  useEffect(() => {
    if (fields.length === 0) {
      setValue('operators', [])
    }
  }, [fields, setValue])

  //TODOx need to add similar validation in vehicleOwnerchange and changeCoOwner
  const { setBeforeSubmitCallback } = props
  useEffect(() => {
    setBeforeSubmitCallback &&
      setBeforeSubmitCallback(async () => {
        let hasError = false
        const selectedNationalIds = []

        const oldOperators = answers.oldOperators.filter(
          (x) => x.wasRemoved !== 'true',
        )
        for (let i = 0; i < oldOperators.length; i++) {
          selectedNationalIds.push(oldOperators[i].nationalId)
        }

        const newOperators = tempNewOperators
        for (let i = 0; i < newOperators.length; i++) {
          if (selectedNationalIds.indexOf(newOperators[i].nationalId) !== -1) {
            setError(`operators[${i}].nationalId`, {
              type: 'custom',
              message: formatMessage(error.duplicateNationalId),
            })
            hasError = true
          } else {
            selectedNationalIds.push(newOperators[i].nationalId)
          }
        }

        if (hasError) {
          return [false, formatMessage(error.duplicateNationalId)]
        } else {
          return [true, null]
        }
      })
  }, [tempNewOperators, answers, answers.oldOperators])

  return (
    <Box>
      {fields.length > 0 ? (
        fields.map((field, index) => {
          return (
            <OperatorRepeaterItem
              id="operators"
              repeaterField={field}
              index={index}
              rowLocation={index + 1}
              key={field.id}
              handleRemove={handleRemove}
              setTempNewOperators={setTempNewOperators}
              tempNewOperators={tempNewOperators}
              {...props}
            />
          )
        })
      ) : (
        <Text variant="h5" marginBottom={2}>
          {formatMessage(information.labels.operator.operatorTempTitle)}
        </Text>
      )}
      <Button
        variant="ghost"
        icon="add"
        iconType="outline"
        onClick={handleAdd.bind(null, undefined)}
      >
        {formatMessage(information.labels.operator.add)}
      </Button>
    </Box>
  )
}
