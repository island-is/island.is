'use client'

import {
  ActionCard,
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import type { SpanType } from '@island.is/island-ui/core/types'
import { coreMessages } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'

import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

type OverviewItem = NonNullable<
  FieldRendererProps['component']['overviewItems']
>[number]

const itemSpan = (width: string | undefined): SpanType | undefined => {
  if (width === 'half') {
    return ['9/12', '9/12', '9/12', '5/12']
  }
  if (width === 'full') {
    return ['12/12', '12/12', '12/12', '12/12']
  }
  return undefined
}

const RenderItem = ({ item }: { item: OverviewItem }) => {
  // Divider-only item (no key/value, just a rule above the next block).
  if (!item.keyText && !item.valueText) {
    return (
      <GridColumn span={itemSpan(item.width)}>
        {item.lineAboveKeyText && (
          <Box paddingBottom={3}>
            <Divider weight="black" thickness="thick" />
          </Box>
        )}
      </GridColumn>
    )
  }

  const value = item.inlineKeyText
    ? `${item.keyText ? `${item.keyText}: ` : ''}${item.valueText ?? ''}`
    : item.valueText ?? ''

  return (
    <GridColumn span={itemSpan(item.width)}>
      {item.lineAboveKeyText && (
        <Box paddingBottom={2}>
          <Divider weight="black" thickness="thick" />
        </Box>
      )}
      {!item.inlineKeyText && item.keyText && (
        <Text variant="h5" as="h4">
          {item.keyText}
        </Text>
      )}
      <Text as="p" fontWeight={item.boldValueText ? 'semiBold' : undefined}>
        {value}
      </Text>
    </GridColumn>
  )
}

export const SdfOverviewField = ({
  component,
  dispatch,
}: FieldRendererProps) => {
  const { formatMessage } = useLocale()
  const items = component.overviewItems ?? []
  const attachments = component.overviewAttachments ?? []
  const titleVariant = (component.titleVariant ?? 'h3') as 'h3' | 'h4' | 'h5'
  const isEditable = Boolean(component.backId)

  const handleEdit = () => {
    if (component.backId && dispatch) {
      // GO_TO_PAGE carries the destination page id in the `event` argument.
      dispatch('GO_TO_PAGE', undefined, undefined, component.backId)
    }
  }

  return (
    <Box {...getSdfFieldMargins(component)}>
      <Divider />
      <Box position="relative" paddingY={4}>
        {isEditable && (
          <Box position="absolute" top={4} right={0} style={{ zIndex: 10 }}>
            <Button variant="utility" icon="pencil" onClick={handleEdit}>
              {formatMessage(coreMessages.buttonEdit)}
            </Button>
          </Box>
        )}
        <Box marginRight={12}>
          {component.label && (
            <Text
              variant={titleVariant}
              as={titleVariant}
              paddingTop={2}
              paddingBottom={component.description ? 2 : 5}
            >
              {component.label}
            </Text>
          )}
          {component.description && (
            <Text as="p" paddingTop={0} paddingBottom={2}>
              {component.description}
            </Text>
          )}
        </Box>
        <GridRow rowGap={3}>
          {items.map((item, i) => (
            <RenderItem key={`overview-item-${i}`} item={item} />
          ))}
          {attachments.map((attachment, i) => (
            <GridColumn
              key={`overview-attachment-${i}`}
              span={[
                '12/12',
                '12/12',
                '12/12',
                attachment.width === 'half' ? '6/12' : '12/12',
              ]}
            >
              <ActionCard
                heading={attachment.fileName}
                renderHeading={(headingEl) => (
                  <Box
                    minWidth={0}
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {headingEl}
                  </Box>
                )}
                text={attachment.fileSize ?? ''}
                headingVariant="h4"
                cta={{ label: '' }}
                tag={{ label: attachment.fileType ?? '' }}
                backgroundColor="blue"
              />
            </GridColumn>
          ))}
        </GridRow>
      </Box>
    </Box>
  )
}
