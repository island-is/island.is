import {
  FieldBaseProps,
  ActionCardListField,
} from '@island.is/application/types'
import { ActionCard, Stack, Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { ActionCardProps } from '@island.is/island-ui/core/types'
import { useUserInfo } from '@island.is/react-spa/bff'

interface Props extends FieldBaseProps {
  field: ActionCardListField
}

export const ActionCardListFormField: FC<Props> = ({ application, field }) => {
  const { items, marginBottom = 4, marginTop = 4, space = 2 } = field
  const { formatMessage, lang } = useLocale()
  const userInfo = useUserInfo()
  return (
    <Box marginBottom={marginBottom} marginTop={marginTop}>
      <Stack space={space}>
        {items(application, lang, userInfo.profile.nationalId || '').map(
          (item, index) => {
            const itemWithTranslatedTexts: ActionCardProps = {
              ...item,
              heading:
                item.heading &&
                formatText(item.heading, application, formatMessage),
              text:
                item.text && formatText(item.text, application, formatMessage),
              tag: item.tag && {
                ...item.tag,
                label: formatText(item.tag?.label, application, formatMessage),
              },
              cta: item.cta && {
                ...item.cta,
                label: formatText(item.cta?.label, application, formatMessage),
              },
              unavailable: {
                ...item.unavailable,
                label:
                  item.unavailable?.label &&
                  formatText(
                    item.unavailable.label,
                    application,
                    formatMessage,
                  ),
                message:
                  item.unavailable?.message &&
                  formatText(
                    item.unavailable.message,
                    application,
                    formatMessage,
                  ),
              },
            }
            return <ActionCard key={index} {...itemWithTranslatedTexts} />
          },
        )}
      </Stack>
    </Box>
  )
}
