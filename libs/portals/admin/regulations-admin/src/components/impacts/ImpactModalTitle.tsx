import { Box, Button, Text } from '@island.is/island-ui/core'
import { DraftImpactForm } from '../../state/types'
import { nameToSlug, RegName } from '@island.is/regulations'
import { ImpactDate } from './ImpactDate'
import { RegulationTag } from '../RegulationTag'

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
  impact: DraftImpactForm
  minDate?: Date
  readOnly?: boolean
}

export const ImpactModalTitle = (props: ImpactModalTitleProps) => {
  const { type, tag, title, name, onChangeDate, impact, minDate, readOnly } =
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
            <RegulationTag disabled>{tag.first}</RegulationTag>
          </Box>
        )}
        {tag?.second && <RegulationTag disabled>{tag.second}</RegulationTag>}
      </Box>
      <Text variant="h3" as="h3" marginBottom={[2, 2, 3, 4]}>
        {type === 'cancel' ? 'Fella á brott ' : 'Textabreyting á '} {title}
      </Text>
      <Box marginBottom={[2, 2, 3, 4]}>
        <Button variant="text" size="small" icon="arrowForward">
          <a
            href={
              'https://island.is/reglugerdir/nr/' + nameToSlug(name as RegName)
            }
            target="_blank"
            rel="noreferrer"
          >
            Skoða breytingasögu reglugerðar
          </a>
        </Button>
      </Box>
      <ImpactDate
        impact={impact}
        size="full"
        minDate={minDate}
        onChange={(newDate) => onChangeDate(newDate)}
        readOnly={readOnly}
      />
    </Box>
  )
}
