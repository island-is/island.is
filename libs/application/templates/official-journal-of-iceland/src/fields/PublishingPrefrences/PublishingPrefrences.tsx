import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { DatePickerController } from '@island.is/shared/form-fields'
import addDays from 'date-fns/addDays'
import addYears from 'date-fns/addYears'
import { FC } from 'react'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { FormGroup } from '../../components/FromGroup/FormGroup'
import { useFormatMessage } from '../../hooks'
import { m } from '../../lib/messages'
import { isWeekday } from '../../utils/isWeekday'

export const PublishingPrefrences: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { f } = useFormatMessage(application)

  const today = new Date()
  const nextYear = addYears(new Date(), 1)

  const availableDates = () => {
    // get all weekdays between today and nextYear
    const weekdays = []
    let day = today
    while (day <= nextYear) {
      if (!isWeekday(day)) {
        weekdays.push(day)
      }
      day = addDays(day, 1)
    }
    return weekdays
  }

  return (
    <Box>
      <FormIntro
        title={f(m.publishingPreferencesFormTitle)}
        description={f(m.publishingPreferencesFormIntro)}
      />
      <FormGroup title={f(m.publishingPreferencesDateLabel)}>
        <DatePickerController
          size="sm"
          backgroundColor="blue"
          id="publishingDate"
          minDate={new Date()}
          maxDate={new Date(new Date().getFullYear() + 1, 11, 31)}
          excludeDates={availableDates()}
          label={f(m.date)}
        />
      </FormGroup>
    </Box>
  )
}
