
import {
  Stack,
  GridRow as Row,
  GridColumn as Column,
  Input,
  DatePicker,
  Checkbox,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import ControlContext from '../../../../context/ControlContext'

export const BaseSettings = () => {
  const { control, controlDispatch, setFocus, focus, formSettingsUpdate } = useContext(ControlContext)
  const { form } = control
  console.log('BaseSettings form', form)
  return (
    <Stack space={2}>
      <Row>
        <Column span='5/10'>
          <Input
            label="Heiti umsóknar"
            placeholder="Heiti umsóknar"
            name="formName"
            value={form?.name?.is ?? ''}
            backgroundColor={'blue'}
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && formSettingsUpdate()}
            onChange={(e) => controlDispatch({ type: 'CHANGE_FORM_NAME', payload: { lang: 'is', newValue: e.target.value } })}
          />
        </Column>
        <Column span='5/10'>
          <Input
            label="Heiti umsóknar (enska)"
            placeholder="Heiti umsóknar (enska)"
            name="formNameEn"
            value={form?.name?.en ?? ''}
            backgroundColor="blue"
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && formSettingsUpdate()}
            onChange={(e) => controlDispatch({ type: 'CHANGE_FORM_NAME', payload: { lang: 'en', newValue: e.target.value } })}
          />
        </Column>
      </Row>
      <Row>
        <Column span="5/10">
          <Input
            label="Líftími umsóknar"
            placeholder="Hámark 120 daga"
            name="applicationsDaysToRemove"
            value={
              form.applicationsDaysToRemove === 0
                ? ''
                : form.applicationsDaysToRemove ?? ''
            }
            backgroundColor="blue"
            type="number"
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && formSettingsUpdate()}
            onChange={(e) => controlDispatch({ type: 'CHANGE_APPLICATION_DAYS_TO_REMOVE', payload: { value: parseInt(e.target.value) } })}
          />
        </Column>
      </Row>
      <Row>
        <Column span="5/10">
          <DatePicker
            label="Umsóknarfrestur"
            placeholderText="Veldu dagsetningu"
            backgroundColor="blue"
            selected={
              form.invalidationDate
                ? new Date(form.invalidationDate)
                : null
            }
            handleChange={(e) => {
              controlDispatch({ type: 'CHANGE_INVALIDATION_DATE', payload: { value: e } })
            }}
            handleCloseCalendar={() => formSettingsUpdate()}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Checkbox
            label="Leyfa notanda að halda áfram í umsókninni með ógild/óútfyllt gildi"
            checked={form.stopProgressOnValidatingStep ?? false}
            onChange={(e) => {
              console.log('stopProgressOnValidatingStep', e.target.checked)
              formSettingsUpdate({ ...form, stopProgressOnValidatingStep: e.target.checked })
            }}

          />
        </Column>
      </Row>
    </Stack>
  )
}

export default BaseSettings
