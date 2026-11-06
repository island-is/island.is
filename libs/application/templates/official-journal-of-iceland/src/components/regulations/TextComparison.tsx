/**
 * Shows the amending regulation's text, which is what gets published,
 * next to the changes recorded on the base regulations, which are applied
 * as recorded whatever the text says. The user confirms that the two
 * match before submitting.
 */
import { Box, Checkbox, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { HTMLDump, HTMLText } from '@island.is/regulations'
import { RegulationImpactSchema } from '../../lib/dataSchema'
import { regulation } from '../../lib/messages'
import { AmendingMismatches } from './AmendingMismatches'
import { BaseChanges } from './BaseChanges'
import * as s from './TextComparison.css'

// ---------------------------------------------------------------------------

type TextComparisonProps = {
  impacts: RegulationImpactSchema[]
  /** Base64-encoded advert HTML */
  advertHtml?: string
  /** The advert's appendixes, content base64-encoded */
  additions?: Array<{
    title?: string
    content?: string
    type?: 'html' | 'file'
  }>
  confirmed: boolean
  onConfirmedChange: (confirmed: boolean) => void
}

export const TextComparison = ({
  impacts,
  advertHtml,
  additions,
  confirmed,
  onConfirmedChange,
}: TextComparisonProps) => {
  const { formatMessage: f } = useLocale()
  const msg = regulation.summary.textComparison

  const html = Buffer.from(advertHtml ?? '', 'base64').toString(
    'utf-8',
  ) as HTMLText

  return (
    <Box marginBottom={4}>
      <Text variant="h3" as="h3" marginBottom={1}>
        {f(msg.heading)}
      </Text>
      <Text marginBottom={3}>{f(msg.intro)}</Text>
      <Stack space={3}>
        <Box>
          <Text variant="h4" as="h4" marginBottom={1}>
            {f(regulation.content.baseChanges.legend)}
          </Text>
          <Box className={s.panel}>
            <BaseChanges impacts={impacts} />
          </Box>
        </Box>
        <Box>
          <Text variant="h4" as="h4" marginBottom={1}>
            {f(msg.amendingText)}
          </Text>
          <Box className={s.panel}>
            <HTMLDump className={s.text} html={html} />
          </Box>
        </Box>
        <AmendingMismatches
          impacts={impacts}
          html={advertHtml}
          additions={additions}
        />
        <Checkbox
          name="amendingTextConfirmed"
          label={f(msg.confirm)}
          checked={confirmed}
          onChange={(e) => onConfirmedChange(e.target.checked)}
          backgroundColor="blue"
          large
        />
      </Stack>
    </Box>
  )
}
