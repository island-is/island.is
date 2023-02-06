import {
  Box,
  Button,
  Column,
  Columns,
  DatePicker,
  Input,
} from '@island.is/island-ui/core'
import { editorMsgs as msg } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { LawChaptersSelect } from './LawChaptersSelect'
import { useDraftingState } from '../state/useDraftingState'

export const EditMeta = () => {
  const { formatMessage: t } = useLocale()
  const { draft, actions } = useDraftingState()

  const type = draft.type
  const typeName =
    type.value &&
    t(type.value === 'amending' ? msg.type_amending : msg.type_base)

  return (
    <>
      <Columns space={3} collapseBelow="lg">
        <Column>
          <Box marginBottom={3}>
            <Input
              label={t(msg.type)}
              value={typeName || ''}
              placeholder={t(msg.typePlaceholder)}
              name="_type"
              size="sm"
              readOnly
              hasError={type.showError && !!type.error}
              errorMessage={type.error && t(type.error)}
            />
            {/*
              NOTE: Maybe we'll need to add a `DraftForm.manualRegulationType` boolean (checkbox)
              to allow "editor"-level users to manually override the auto-detected type.
              But as soon as the editor unticks that checkbox, then the auto-detection should kick back in.
            */}
          </Box>
        </Column>

        <Column>
          <Box marginBottom={3}>
            <DatePicker
              size="sm"
              label={t(msg.effectiveDate)}
              placeholderText={t(msg.effectiveDate_default)}
              minDate={draft.idealPublishDate.value || null}
              selected={draft.effectiveDate.value}
              handleChange={(date: Date) =>
                actions.updateState('effectiveDate', date)
              }
              hasError={
                draft.effectiveDate.showError && !!draft.effectiveDate.error
              }
              errorMessage={
                draft.effectiveDate.error && t(draft.effectiveDate.error)
              }
              backgroundColor="blue"
            />
            {!!draft.effectiveDate.value && (
              <Button
                size="small"
                variant="text"
                preTextIcon="close"
                onClick={() => {
                  actions.updateState('effectiveDate', undefined)
                }}
              >
                {t(msg.effectiveDate_default)}
              </Button>
            )}
          </Box>
        </Column>
      </Columns>

      <LawChaptersSelect />
    </>
  )
}
