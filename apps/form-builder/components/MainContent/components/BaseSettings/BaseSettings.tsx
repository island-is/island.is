import { useContext, useState, FocusEvent } from 'react'
import {
  Stack,
  GridRow as Row,
  GridColumn as Column,
  Input,
  DatePicker,
  Checkbox,
} from '@island.is/island-ui/core'
import FormBuilderContext from '../../../../context/FormBuilderContext'
import LayoutContext from '../../../../context/LayoutContext'
import { saveFormSettings } from '../../../../services/apiService'

export default function BaseSettings() {
  const { formBuilder, formDispatch, setIsTyping } =
    useContext(FormBuilderContext)
  const { infoDispatch } = useContext(LayoutContext)
  const [focus, setFocus] = useState(null)
  const {
    id,
    name,
    applicationsDaysToRemove,
    invalidationDate,
    stopProgressOnValidatingStep,
  } = formBuilder.form
  return (
    <Stack space={2}>
      <Row>
        <Column span="5/10">
          <Input
            label="Heiti umsóknar"
            placeholder="Heiti umsóknar"
            name="formName"
            value={formBuilder.form.name.is ?? ''}
            backgroundColor="blue"
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => blur(e)}
            onChange={(e) => {
              setIsTyping(true)
              formDispatch({
                type: 'changeName',
                payload: {
                  lang: 'is',
                  newName: e.target.value,
                },
              })
              infoDispatch({
                type: 'changeApplicationName',
                data: e.target.value,
              })
            }}
          />
        </Column>
        <Column span="5/10">
          <Input
            label="Heiti umsóknar (enska)"
            placeholder="Heiti umsóknar (enska)"
            name="formNameEn"
            value={formBuilder.form.name.en ?? ''}
            backgroundColor="blue"
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => blur(e)}
            onChange={(e) => {
              setIsTyping(true)
              formDispatch({
                type: 'changeName',
                payload: {
                  lang: 'en',
                  newName: e.target.value,
                },
              })
            }}
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
              formBuilder.form.applicationsDaysToRemove === 0
                ? ''
                : formBuilder.form.applicationsDaysToRemove
            }
            backgroundColor="blue"
            type="number"
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => blur(e)}
            onChange={(e) => {
              setIsTyping(true)
              formDispatch({
                type: 'applicationsDaysToRemove',
                payload: { value: e.target.value },
              })
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column span="5/10">
          {formBuilder.form.invalidationDate ? (
            <DatePicker
              label="Umsóknarfrestur"
              placeholderText="Veldu dagsetningu"
              backgroundColor="blue"
              selected={new Date(formBuilder.form.invalidationDate)}
              handleChange={(e) => {
                formDispatch({
                  type: 'invalidationDate',
                  payload: { value: e.toJSON() },
                })
              }}
            />
          ) : (
            <DatePicker
              label="Umsóknarfrestur"
              placeholderText="Veldu dagsetningu"
              backgroundColor="blue"
              handleChange={(e) => {
                formDispatch({
                  type: 'invalidationDate',
                  payload: { value: e.toJSON() },
                })
              }}
            />
          )}
        </Column>
      </Row>
      <Row>
        <Column>
          <Checkbox
            label="Leyfa notanda að halda áfram í umsókninni með ógild/óútfyllt gildi"
            checked={formBuilder.form.stopProgressOnValidatingStep}
            onChange={(e) => {
              formDispatch({
                type: 'stopProgressOnValidatingStep',
                payload: { value: e.target.checked },
              })
            }}
          />
        </Column>
      </Row>
    </Stack>
  )

  function blur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (focus !== e.target.value) {
      setFocus(null)
      const toSave = {
        id: id,
        name: name,
        applicationsDaysToRemove: applicationsDaysToRemove,
        invalidationDate: invalidationDate,
        stopProgressOnValidatingStep: stopProgressOnValidatingStep,
      }
      saveFormSettings(id, toSave)
    }
    setIsTyping(false)
  }
}
