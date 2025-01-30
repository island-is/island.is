import { formatText, formatTextWithLocale } from '@island.is/application/core'
import { AccordionCard, Box, BulletList } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import {
  ExpandableDescriptionField,
  FieldBaseProps,
} from '@island.is/application/types'
import { Markdown } from '@island.is/shared/components'
import { Locale } from '@island.is/shared/types'
interface Props extends FieldBaseProps {
  field: ExpandableDescriptionField
}

export const ExpandableDescriptionFormField: FC<
  React.PropsWithChildren<Props>
> = ({ application, field }) => {
  const { formatMessage, lang: locale } = useLocale()
  const { marginTop = 2, marginBottom = 2 } = field

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      <AccordionCard
        startExpanded={field.startExpanded}
        id={`BulletPointFormField-${field.id}`}
        label={formatTextWithLocale(
          field.title ?? '',
          application,
          locale as Locale,
          formatMessage,
        )}
        labelVariant="h3"
      >
        {field.introText && (
          <Box marginBottom={4}>
            <Markdown>
              {formatText(field.introText, application, formatMessage)}
            </Markdown>
          </Box>
        )}
        <BulletList space="gutter" type="ul">
          <Markdown>
            {formatTextWithLocale(
              field.description,
              application,
              locale as Locale,
              formatMessage,
            )}
          </Markdown>
        </BulletList>
      </AccordionCard>
    </Box>
  )
}
