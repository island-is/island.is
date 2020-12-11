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

export type CategoryFormOption = {
  label: 'Flokkur'
  value: string
}

export type TypeFormOption = {
  label: 'Tegund'
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

export const StatisticForm: FC<Props> = ({ onSubmit }) => {
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
              render={({ onChange, value, name }) => (
                <Input
                  name={name}
                  value={value}
                  onChange={onChange}
                  placeholder={formatMessage({
                    id: 'service.portal:document-provider-statistics-file-name',
                    defaultMessage: 'Leitaðu eftir skjalaheiti',
                  })}
                  backgroundColor="blue"
                  icon="search"
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
              render={({ onChange, value, name }) => (
                <Select
                  name={name}
                  value={value}
                  onChange={onChange}
                  placeholder="Veldu flokk"
                  label={formatMessage({
                    id: 'service.portal:document-provider-category',
                    defaultMessage: 'Flokkur',
                  })}
                  options={[
                    { label: 'Fjármál', value: 'fjarmal' },
                    { label: 'Annað', value: 'annad' },
                  ]}
                />
              )}
            />
          </GridColumn>
          <GridColumn span="6/12">
            <Controller
              control={control}
              name="type"
              defaultValue=""
              render={({ onChange, value, name }) => (
                <Select
                  name={name}
                  value={value}
                  onChange={onChange}
                  placeholder="Veldu tegund"
                  label={formatMessage({
                    id: 'service.portal:document-provider-statistics-type',
                    defaultMessage: 'Tegund',
                  })}
                  options={[
                    { label: 'Greiðsluseðill', value: 'greidslusedill' },
                    { label: 'Tilkynning', value: 'tilkynning' },
                  ]}
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
              render={({ onChange, value }) => (
                <DatePicker
                  label="Dagsetning frá"
                  placeholderText={formatMessage({
                    id: 'service.portal:document-provider-statistics-date-from',
                    defaultMessage: 'Veldu dagsetningu',
                  })}
                  selected={value}
                  locale="is"
                  handleChange={onChange}
                />
              )}
            />
          </GridColumn>
          <GridColumn span="6/12">
            <Controller
              name="dateTo"
              defaultValue={false}
              control={control}
              render={({ onChange, value }) => (
                <DatePicker
                  label="Dagsetning til"
                  placeholderText={formatMessage({
                    id: 'service.portal:document-provider-statistics-date-to',
                    defaultMessage: 'Veldu dagsetningu',
                  })}
                  selected={value}
                  locale="is"
                  handleChange={onChange}
                />
              )}
            />
          </GridColumn>
        </GridRow>
        <Box marginBottom={2} />
        <Button type="submit" variant="primary" icon="arrowForward">
          Leitaðu
        </Button>
      </Box>
    </form>
  )
}
