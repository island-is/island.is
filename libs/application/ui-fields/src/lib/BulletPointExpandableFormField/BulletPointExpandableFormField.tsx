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
  BulletPointExpandableField,
  FieldBaseProps,
} from '@island.is/application/types'
import Markdown from 'markdown-to-jsx'

interface Props extends FieldBaseProps {
  field: BulletPointExpandableField
}

export const BulletPointExpandableFormField: FC<Props> = ({
  application,
  field,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginY={2}>
      <AccordionCard
        startExpanded={field.startExpanded}
        id={`BulletPointFormField-${field.id}`}
        label={formatText(field.title, application, formatMessage)}
        labelVariant="h3"
      >
        <Text marginBottom={4}>
          {formatText(field.introText, application, formatMessage)}
        </Text>

        <BulletList space={2} type="ul">
          <Markdown
            options={{
              forceBlock: true,
              overrides: {
                li: {
                  component: Bullet,
                },
              },
            }}
          >
            {formatText(field.bulletPoints, application, formatMessage)}
          </Markdown>
        </BulletList>
      </AccordionCard>
    </Box>
  )
}
