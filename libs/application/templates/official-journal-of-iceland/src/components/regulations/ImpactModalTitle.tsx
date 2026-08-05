/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/ImpactModalTitle.tsx
 *
 * Header section of the impact editing modal with title, tags, and date picker.
 * Adapted to work with RegulationImpactSchema instead of DraftImpactForm.
 */
import { Box, Button, Tag, Text } from '@island.is/island-ui/core'
import { nameToSlug, RegName } from '@island.is/regulations'
import { ImpactDate } from './ImpactDate'

// ---------------------------------------------------------------------------

export type ImpactModalTitleProps = {
  type: 'edit' | 'cancel'
  tag?: {
    first?: string
    second?: string
  }
  title?: string
  name: string
  onChangeDate: (newDate: Date | undefined) => void
  date?: string // ISODate string from answers
  minDate?: Date
  readOnly?: boolean
}

export const ImpactModalTitle = (props: ImpactModalTitleProps) => {
  const { type, tag, title, name, onChangeDate, date, minDate, readOnly } =
    props

  return (
    <Box paddingY={4}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        marginBottom={3}
      >
        {tag?.first && (
          <Box marginRight={2}>
            <Tag disabled>{tag.first}</Tag>
          </Box>
        )}
        {tag?.second && <Tag disabled>{tag.second}</Tag>}
      </Box>
      <Text variant="h3" as="h3" marginBottom={[2, 2, 3, 4]}>
        {type === 'cancel' ? 'Fella á brott ' : 'Textabreyting á '} {title}
      </Text>
      {name !== 'self' && (
        <Box marginBottom={[2, 2, 3, 4]}>
          <Button variant="text" size="small" icon="arrowForward">
            <a
              href={
                'https://island.is/reglugerdir/nr/' +
                nameToSlug(name as RegName)
              }
              target="_blank"
              rel="noreferrer"
            >
              Skoða breytingasögu reglugerðar
            </a>
          </Button>
        </Box>
      )}
      <ImpactDate
        date={date}
        size="full"
        minDate={minDate}
        onChange={onChangeDate}
        readOnly={readOnly}
      />
    </Box>
  )
}
