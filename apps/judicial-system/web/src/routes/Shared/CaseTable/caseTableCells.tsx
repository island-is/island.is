import type { ReactNode } from 'react'

import type { TagVariant } from '@island.is/island-ui/core'
import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'
import TagContainer from '@island.is/judicial-system-web/src/components/Tags/TagContainer/TagContainer'
import type {
  CaseTableCell,
  StringGroupValue,
  StringValue,
  TagGroupValue,
  TagValue,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { compareLocaleIS } from '@island.is/judicial-system-web/src/utils/sortHelper'

import * as styles from './CaseTable.css'

export const compare = (a: CaseTableCell, b: CaseTableCell): number => {
  return compareLocaleIS(a.sortValue, b.sortValue)
}

export const renderString = (value: StringValue) => {
  return <Text>{value.str}</Text>
}

export const renderStringGroup = (value: StringGroupValue) => {
  const strings = value.strList.filter((v) => v !== '')
  const length = strings.length

  return (
    <Box display="flex" flexDirection="column">
      {strings.map((s, idx) => (
        <Box key={idx} className={styles.stringGroupItem}>
          {idx === length - 1 && value.hasCheckMark && (
            <Icon icon="checkmark" color="blue400" size="medium" />
          )}
          {length < 3 && idx === 0 ? (
            <Text>{s}</Text>
          ) : (
            <Text as="span" variant="small">
              {s}
            </Text>
          )}
        </Box>
      ))}
    </Box>
  )
}

export const renderTag = (value: TagValue) => {
  return (
    <Tag variant={value.color as TagVariant} outlined disabled truncate>
      {value.text}
    </Tag>
  )
}

export const renderTagGroup = (value: TagGroupValue) => {
  const { firstTag, secondTag, thirdTag } = value

  return (
    <TagContainer>
      {renderTag(firstTag)}
      {secondTag && renderTag(secondTag)}
      {thirdTag && renderTag(thirdTag)}
    </TagContainer>
  )
}

export const render = (cell: CaseTableCell): ReactNode => {
  if (!cell.value) {
    return null
  }

  const value = cell.value

  switch (value.__typename) {
    case 'StringValue':
      return renderString(value)
    case 'StringGroupValue':
      return renderStringGroup(value)
    case 'TagValue':
      return renderTag(value)
    case 'TagGroupValue':
      return renderTagGroup(value)
    // This should never happen, but if it does, we return null
    default:
      return null
  }
}
