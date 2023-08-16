import { formatText } from '@island.is/application/core'
import {
  AccordionCard,
  Box,
  Bullet,
  BulletList,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import {
  ExpandableDescriptionField,
  FieldBaseProps,
} from '@island.is/application/types'
import Markdown from 'markdown-to-jsx'
interface Props extends FieldBaseProps {
  field: ExpandableDescriptionField
}

export const ExpandableDescriptionFormField: FC<
  React.PropsWithChildren<Props>
> = ({ application, field }) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginY={2}>
      <AccordionCard
        startExpanded={field.startExpanded}
        id={`BulletPointFormField-${field.id}`}
        label={formatText(field.title, application, formatMessage)}
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
          <Markdown
            options={{
              overrides: {
                li: {
                  component: Bullet,
                },
              },
            }}
          >
            {formatText(field.description, application, formatMessage)}
          </Markdown>
        </BulletList>
      </AccordionCard>
    </Box>
  )
}
