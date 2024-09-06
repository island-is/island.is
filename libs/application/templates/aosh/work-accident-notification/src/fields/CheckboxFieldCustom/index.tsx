import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import { Box, Checkbox, GridColumn, GridRow } from '@island.is/island-ui/core'
import { CheckboxController } from '@island.is/shared/form-fields'
import { getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'

type WorkplaceHealthAndSafety = {
  // TODO REMOVE ME WHEN WE GET GENERATED TYPES FROM API
  Vinnuver: number
  Heiti: string
  Röð: number
}

export const CheckboxFieldCustom: FC<
  React.PropsWithChildren<FieldBaseProps>
> = (props) => {
  const { application } = props
  const { setValue } = useFormContext()
  const [choice, setChoice] = useState<string[]>([])
  // TODO Remove as state if we don't end up setting this state
  const [normalOptions, setNormalOptions] = useState<
    WorkplaceHealthAndSafety[]
  >(
    (
      getValueViaPath(
        application.externalData,
        'aoshData.data.workplaceHealthAndSafety',
      ) as WorkplaceHealthAndSafety[]
    )
      .filter((x) => x.Röð !== 7)
      .sort((a, b) => a.Röð - b.Röð),
  )
  // TODO Remove as state if we don't end up setting this state
  const [exceptionOption, setExceptionOption] = useState<
    WorkplaceHealthAndSafety[]
  >(
    (
      getValueViaPath(
        application.externalData,
        'aoshData.data.workplaceHealthAndSafety',
      ) as WorkplaceHealthAndSafety[]
    ).filter((x) => x.Röð === 7),
  )

  useEffect(() => {
    // TODO setValue is not being set to answers. Need to look at that.
    const options = getValueViaPath(
      application.externalData,
      'aoshData.data.workplaceHealthAndSafety',
    ) as WorkplaceHealthAndSafety[]
    setValue(
      'workhealthAndSafetyOccupation.data',
      options.filter((option) => choice.includes(option.Vinnuver.toString())),
    )
  }, [application.externalData, choice, setValue])

  return (
    <Box>
      <Controller
        name={''}
        render={() => (
          <GridRow>
            {normalOptions
              .filter((x) => x.Röð !== 7)
              .sort((a, b) => a.Röð - b.Röð)
              .map((option, index) => (
                <GridColumn
                  span={['1/1', '1/1']}
                  paddingBottom={2}
                  key={`option-${option.Heiti}`}
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
                    checked={
                      choice && choice.includes(option.Vinnuver.toString())
                    }
                    id={`option[${index}]`}
                    label={option.Heiti}
                    disabled={choice.includes('1')}
                    value={option.Vinnuver.toString()}
                    backgroundColor="blue"
                  />
                </GridColumn>
              ))}
          </GridRow>
        )}
      />
      <Controller
        name={''}
        render={({ field: { value } }) => (
          <GridRow>
            {exceptionOption.map((option, index) => (
              <GridColumn
                span={['1/1', '1/1']}
                paddingBottom={2}
                key={`option-${option.Heiti}`}
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
                  checked={value && value.includes(option.Vinnuver)}
                  id={`exceptionOption[${index}]`}
                  label={option.Heiti}
                  value={option.Vinnuver.toString()}
                  backgroundColor="blue"
                />
              </GridColumn>
            ))}
          </GridRow>
        )}
      />
    </Box>
  )
}
