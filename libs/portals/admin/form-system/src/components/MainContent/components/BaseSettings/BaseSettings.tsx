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
  const {
    control,
    controlDispatch,
    setFocus,
    focus,
    formUpdate,
    updateSettings,
  } = useContext(ControlContext)
  const { form } = control
  return (
    <Stack space={2}>
      <Row>
        <Column span="5/10">
          <Input
            label="Heiti umsóknar"
            placeholder="Heiti umsóknar"
            name="formName"
            value={form?.name?.is ?? ''}
            backgroundColor={'blue'}
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
            label="Heiti umsóknar (enska)"
            placeholder="Heiti umsóknar (enska)"
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
            label="Umsóknarfrestur"
            placeholderText="Veldu dagsetningu"
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
            label="Leyfa notanda að halda áfram í umsókninni með ógild/óútfyllt gildi"
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

export default BaseSettings
