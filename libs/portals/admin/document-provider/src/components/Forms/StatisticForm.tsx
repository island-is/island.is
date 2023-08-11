import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  GridColumn,
  GridRow,
  Select,
  Input,
  DatePicker,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

export type CategoryFormOption = {
  label: string
  value: string
}

export type TypeFormOption = {
  label: string
  value: string
}

export interface StatisticFormData {
  fileName: string
  category: CategoryFormOption
  type: TypeFormOption
  dateFrom: string
  dateTo: string
}

interface Props {
  onSubmit: (data: StatisticFormData) => void
}

export const StatisticForm: FC<React.PropsWithChildren<Props>> = ({
  onSubmit,
}) => {
  const { handleSubmit, control } = useForm()
  const { formatMessage } = useLocale()
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <GridRow>
          <GridColumn span="12/12">
            <Controller
              control={control}
              name="fileName"
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  size="xs"
                  name={name}
                  value={value}
                  onChange={onChange}
                  placeholder={formatMessage(m.DashBoardStatisticsFileName)}
                  backgroundColor="blue"
                  icon={{ name: 'search' }}
                />
              )}
            />
          </GridColumn>
        </GridRow>
        <Box marginBottom={2} />
        <GridRow>
          <GridColumn span="6/12">
            <Controller
              control={control}
              name="category"
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Select
                  name={name}
                  value={value}
                  onChange={onChange}
                  placeholder={formatMessage(
                    m.DashBoardStatisticsCategoryPlaceHolder,
                  )}
                  label={formatMessage(m.DashBoardStatisticsCategory)}
                  //   need translations for this when implemented
                  options={[
                    { label: 'Fjármál', value: 'fjarmal' },
                    { label: 'Annað', value: 'annad' },
                  ]}
                  size="xs"
                />
              )}
            />
          </GridColumn>
          <GridColumn span="6/12">
            <Controller
              control={control}
              name="type"
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Select
                  name={name}
                  value={value}
                  onChange={onChange}
                  placeholder={formatMessage(
                    m.DashBoardStatisticsTypePlaceHolder,
                  )}
                  label={formatMessage(m.DashBoardStatisticsType)}
                  //   need translations for this when implemented
                  options={[
                    { label: 'Greiðsluseðill', value: 'greidslusedill' },
                    { label: 'Tilkynning', value: 'tilkynning' },
                  ]}
                  size="xs"
                />
              )}
            />
          </GridColumn>
        </GridRow>
        <Box marginBottom={2} />
        <GridRow>
          <GridColumn span="6/12">
            <Controller
              name="dateFrom"
              defaultValue={false}
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label={formatMessage(m.DashBoardStatisticsDateFrom)}
                  placeholderText={formatMessage(
                    m.DashBoardStatisticsDateFromPlaceHolder,
                  )}
                  selected={value}
                  locale="is"
                  handleChange={onChange}
                  size="xs"
                />
              )}
            />
          </GridColumn>
          <GridColumn span="6/12">
            <Controller
              name="dateTo"
              defaultValue={false}
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label={formatMessage(m.DashBoardStatisticsDateTo)}
                  placeholderText={formatMessage(
                    m.DashBoardStatisticsDateToPlaceHolder,
                  )}
                  selected={value}
                  locale="is"
                  handleChange={onChange}
                  size="xs"
                />
              )}
            />
          </GridColumn>
        </GridRow>
        <Box marginTop={2} display="flex" justifyContent="flexEnd">
          <Button type="submit" variant="primary" icon="arrowForward">
            {formatMessage(m.DashBoardStatisticsSearchButton)}
          </Button>
        </Box>
      </Box>
    </form>
  )
}
