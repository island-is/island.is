import {
  Stack,
  GridRow as Row,
  GridColumn as Column,
  Input,
  DatePicker,
  Checkbox,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { useIntl } from 'react-intl'
import { m } from '../../../../lib/messages'

export const BaseSettings = () => {
  const {
    control,
    controlDispatch,
    setFocus,
    focus,
    formUpdate,
    updateSettings,
  } = useContext(ControlContext)
  const { form } = control
  const { formatMessage } = useIntl()
  return (
    <Stack space={2}>
      <Row>
        <Column span="5/10">
          <Input
            label={formatMessage(m.applicationName)}
            placeholder={formatMessage(m.applicationName)}
            name="formName"
            value={form?.name?.is ?? ''}
            backgroundColor="blue"
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && formUpdate()}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_FORM_NAME',
                payload: { lang: 'is', newValue: e.target.value },
              })
            }
          />
        </Column>
        <Column span="5/10">
          <Input
            label={formatMessage(m.applicationNameEnglish)}
            placeholder={formatMessage(m.applicationNameEnglish)}
            name="formNameEn"
            value={form?.name?.en ?? ''}
            backgroundColor="blue"
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && formUpdate()}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_FORM_NAME',
                payload: { lang: 'en', newValue: e.target.value },
              })
            }
          />
        </Column>
      </Row>
      <Row>
        <Column span="5/10">
          <Input
            label={formatMessage(m.daysUntilExpiration)}
            placeholder={formatMessage(m.max120Days)}
            name="applicationsDaysToRemove"
            value={
              form.applicationsDaysToRemove === 0
                ? ''
                : form.applicationsDaysToRemove ?? ''
            }
            backgroundColor="blue"
            type="number"
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && formUpdate()}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_APPLICATION_DAYS_TO_REMOVE',
                payload: { value: parseInt(e.target.value) },
              })
            }
          />
        </Column>
      </Row>
      <Row>
        <Column span="5/10">
          <DatePicker
            label={formatMessage(m.deadline)}
            placeholderText={formatMessage(m.chooseDate)}
            backgroundColor="blue"
            selected={
              form.invalidationDate ? new Date(form.invalidationDate) : null
            }
            handleChange={(e) => {
              controlDispatch({
                type: 'CHANGE_INVALIDATION_DATE',
                payload: { value: e },
              })
            }}
            handleCloseCalendar={() => formUpdate()}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Checkbox
            label={formatMessage(m.allowProgress)}
            checked={form.stopProgressOnValidatingStep ?? false}
            onChange={(e) => {
              controlDispatch({
                type: 'CHANGE_STOP_PROGRESS_ON_VALIDATING_STEP',
                payload: { value: e.target.checked },
              })
              updateSettings({
                ...form,
                stopProgressOnValidatingStep: e.target.checked,
              })
            }}
          />
        </Column>
      </Row>
    </Stack>
  )
}
