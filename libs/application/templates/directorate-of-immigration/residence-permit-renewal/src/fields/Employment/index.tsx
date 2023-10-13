import { FieldBaseProps } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { EmploymentItem } from '../../shared'
import { getValueViaPath } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { RepeatableEmployment } from './RepeatableEmployment'
import { information } from '../../lib/messages'

export const Employment: FC<FieldBaseProps> = (props) => {
  const { application, errors } = props
  const { formatMessage } = useLocale()
  const [showItemTitle, setShowItemTitle] = useState(false)
  const isPermitTypeEmployment = getValueViaPath(
    application.externalData,
    'applicantCurrentResidencePermitType.data.isPermitTypeEmployment',
    false,
  ) as boolean

  const isWorkPermitTypeSpecial = getValueViaPath(
    application.externalData,
    'applicantCurrentResidencePermitType.data.isWorkPermitTypeSpecial',
    false,
  ) as boolean

  const [employmentList, setEmploymentList] = useState<EmploymentItem[]>(
    getValueViaPath(application.answers, 'employment.selectedEmployments', [
      {
        country: '',
        wasRemoved: 'false',
        dateFrom: '',
        dateTo: '',
        name: '',
        employmentContract: '',
        applicationFile: '',
        typeOfEmployment: '',
      },
    ]) as EmploymentItem[],
  )

  const [filteredEmploymentList, setFilteredEmploymentList] = useState(
    employmentList.filter((x) => x.wasRemoved !== 'true'),
  )

  useEffect(() => {
    setFilteredEmploymentList(
      employmentList.filter((x) => x.wasRemoved !== 'true'),
    )
  }, [employmentList])

  const handleAdd = () => {
    setEmploymentList([
      ...employmentList,
      {
        country: '',
        wasRemoved: 'false',
        dateFrom: '',
        dateTo: '',
        name: '',
        employmentContract: '',
        applicationFile: '',
        typeOfEmployment: '',
      },
    ])
    setShowItemTitle(filteredEmploymentList.length > 0)
  }

  const handleRemove = (pos: number) => {
    if (pos > -1) {
      setEmploymentList(
        employmentList.map((employment, index) => {
          if (index === pos) {
            return { ...employment, wasRemoved: 'true' }
          }
          return employment
        }),
      )
      setShowItemTitle(filteredEmploymentList.length > 0)
    }
  }

  const addDataToEmploymentList = (
    field: string,
    value: any,
    newIndex: number,
  ) => {
    setEmploymentList(
      employmentList.map((employment, index) => {
        if (newIndex === index) {
          return { ...employment, [field]: value }
        }
        return employment
      }),
    )
  }

  return (
    <Box>
      {employmentList.map((field, index) => {
        const position = filteredEmploymentList.indexOf(field)
        return (
          <RepeatableEmployment
            id={`${props.field.id}.selectedCriminalCountries`}
            repeaterField={field}
            index={index}
            key={`criminalRecord-${index}`}
            handleRemove={handleRemove}
            itemNumber={position}
            addDataToEmploymentList={addDataToEmploymentList}
            showItemTitle={showItemTitle}
            {...props}
          />
        )
      })}
      <Box paddingTop={2}>
        <Button
          variant="ghost"
          icon="add"
          iconType="outline"
          fluid
          size="large"
          onClick={handleAdd}
        >
          <Text variant="h5" color="blue400">
            {formatMessage(
              information.labels.employment.addEmploymentButtonLabel,
            )}
          </Text>
        </Button>
      </Box>
    </Box>
  )
}
