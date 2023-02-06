import {
  Box,
  Button,
  Column,
  Columns,
  DatePicker,
  Inline,
  Input,
} from '@island.is/island-ui/core'
import { editorMsgs as msg } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { useDraftingState } from '../state/useDraftingState'
import { getMinPublishDate } from '../utils'

export const EditPublish = () => {
  const t = useLocale().formatMessage
  const { draft, actions } = useDraftingState()
  const { publish } = actions

  return (
    <>
      <Box marginBottom={3}>
        <Columns space={3} collapseBelow="lg">
          <Column>
            <Box marginBottom={3}>
              <Input
                label={t(msg.name)}
                value={draft.name.value}
                name="_name"
                size="sm"
                hasError={draft.name.showError && !!draft.name.error}
                errorMessage={draft.name.error && t(draft.name.error)}
                onChange={(e) => actions.updateState('name', e.target.value)}
              />
            </Box>
          </Column>

          <Column>
            <Box marginBottom={3}>
              <DatePicker
                size="sm"
                label={t(msg.publishDate)}
                placeholderText={t(msg.idealPublishDate_default)}
                minDate={getMinPublishDate(
                  draft.fastTrack.value,
                  draft.signatureDate.value,
                )}
                selected={draft.idealPublishDate.value}
                handleChange={(date: Date) =>
                  actions.updateState('idealPublishDate', date)
                }
                hasError={
                  draft.idealPublishDate.showError &&
                  !!draft.idealPublishDate.error
                }
                errorMessage={
                  draft.idealPublishDate.error &&
                  t(draft.idealPublishDate.error)
                }
                backgroundColor="blue"
              />
            </Box>
          </Column>
        </Columns>
      </Box>
      {publish && (
        <Box marginBottom={3} display="flex" flexWrap="wrap">
          <Inline space={2} flexWrap="wrap">
            <Button
              onClick={() => publish()}
              variant="primary"
              disabled={!draft.name.value}
            >
              {t(msg.publish_button)}
            </Button>
          </Inline>
        </Box>
      )}
    </>
  )
}
