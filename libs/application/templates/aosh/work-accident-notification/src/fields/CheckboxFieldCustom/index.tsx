import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import {
  AlertMessage,
  Box,
  Checkbox,
  ErrorMessage,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'
import { WorkplaceHealthAndSafetyDto } from '@island.is/clients/work-accident-ver'
import { WorkAccidentNotification } from '../../lib/dataSchema'
import { useLocale } from '@island.is/localization'
import { information } from '../../lib/messages/information'

export const CheckboxFieldCustom: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { application, errors } = props
  const answers = application.answers as WorkAccidentNotification
  const { setValue } = useFormContext()
  const [choice, setChoice] = useState<string[]>(
    answers?.companyLaborProtection?.workhealthAndSafetyOccupation || [],
  )
  const { formatMessage } = useLocale()

  const normalOptions = (
    getValueViaPath(
      application.externalData,
      'aoshData.data.workplaceHealthAndSafety',
    ) as WorkplaceHealthAndSafetyDto[]
  ).filter((x) => x.code !== '1')

  const exceptionOption = (
    getValueViaPath(
      application.externalData,
      'aoshData.data.workplaceHealthAndSafety',
    ) as WorkplaceHealthAndSafetyDto[]
  ).filter((x) => x.code === '1')

  useEffect(() => {
    const options = getValueViaPath(
      application.externalData,
      'aoshData.data.workplaceHealthAndSafety',
    ) as WorkplaceHealthAndSafetyDto[]
    setValue(
      'companyLaborProtection.workhealthAndSafetyOccupation',
      options
        .filter((option) => choice.includes(option.code || ''))
        .map((option) => option.code),
    )
  }, [application.externalData, choice, setValue])

  return (
    <Box>
      <Box>
        <Controller
          name={`workhealthAndSafetyOptions`}
          render={() => (
            <GridRow>
              {normalOptions.map((option, index) => (
                <GridColumn
                  span={['1/1', '1/1']}
                  paddingBottom={2}
                  key={`option-${option.name}`}
                >
                  <Checkbox
                    large
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChoice((curr) => [...curr, e.target.value])
                      } else {
                        setChoice((curr) =>
                          curr.filter((choice) => choice !== e.target.value),
                        )
                      }
                    }}
                    checked={choice && choice.includes(option.code || '')}
                    id={`option[${index}]`}
                    label={option.name}
                    disabled={choice.includes('1')}
                    value={option.code || ''}
                    backgroundColor="blue"
                  />
                </GridColumn>
              ))}
            </GridRow>
          )}
        />
        <Controller
          name={''}
          render={() => (
            <GridRow>
              {exceptionOption.map((option, index) => (
                <GridColumn
                  span={['1/1', '1/1']}
                  paddingBottom={2}
                  key={`option-${option.name}`}
                >
                  <Checkbox
                    large
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChoice([e.target.value])
                      } else {
                        setChoice([])
                      }
                    }}
                    checked={choice && choice.includes(option.code || '')}
                    id={`exceptionOption[${index}]`}
                    label={option.name}
                    value={option.code || ''}
                    backgroundColor="blue"
                  />
                </GridColumn>
              ))}
            </GridRow>
          )}
        />
      </Box>
      {errors &&
        getErrorViaPath(
          errors,
          'companyLaborProtection.workhealthAndSafetyOccupation',
        ) && (
          <Box>
            <ErrorMessage
              children={formatMessage(information.labels.workhealth.errorAlert)}
            />
          </Box>
        )}
    </Box>
  )
}
