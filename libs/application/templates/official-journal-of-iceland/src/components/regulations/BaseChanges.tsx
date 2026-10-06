/**
 * Lists the changes the amending regulation records on each base
 * regulation: the diff of every amend impact (text and appendixes) and a
 * note for every repeal. Used to compare the amending regulation's text,
 * which is what gets published, against what is applied to the base.
 */
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { HTMLDump, HTMLText, prettyName, RegName } from '@island.is/regulations'
import { RegulationImpactSchema } from '../../lib/dataSchema'
import { regulation } from '../../lib/messages'
import { hasAnyChange } from '../../utils/formatAmendingUtils'
import * as s from './BaseChanges.css'

// ---------------------------------------------------------------------------

type BaseChangesProps = {
  impacts: RegulationImpactSchema[]
}

export const BaseChanges = ({ impacts }: BaseChangesProps) => {
  const { formatMessage: f, formatDateFns } = useLocale()

  return (
    <Stack space={4}>
      {impacts.map((impact) => {
        const { id, name, regTitle, type, date, diff, appendixes } = impact
        const heading = regTitle
          ? `${prettyName(name as RegName)} – ${regTitle}`
          : prettyName(name as RegName)
        const changedAppendixes = (appendixes ?? []).filter(
          (apx) => apx.diff && hasAnyChange(apx.diff),
        )
        const hasTextChange = !!diff && hasAnyChange(diff)

        return (
          <Box key={id}>
            <Text variant="h4" as="h4">
              {heading}
            </Text>
            {date && (
              <Text variant="small" color="dark400" marginBottom={2}>
                {formatDateFns(new Date(date), 'd. MMM yyyy')}
              </Text>
            )}
            {type === 'repeal' ? (
              <Text>{f(regulation.content.baseChanges.repealed)}</Text>
            ) : (
              <>
                {hasTextChange ? (
                  <HTMLDump className={s.diff} html={diff as HTMLText} />
                ) : (
                  !changedAppendixes.length && (
                    <Text>
                      {f(regulation.content.baseChanges.noTextChange)}
                    </Text>
                  )
                )}
                {changedAppendixes.map((apx, i) => (
                  <div className={s.appendix} key={i}>
                    {apx.title && (
                      <h4 className={s.appendixTitle}>{apx.title}</h4>
                    )}
                    <HTMLDump className={s.diff} html={apx.diff as HTMLText} />
                  </div>
                ))}
              </>
            )}
          </Box>
        )
      })}
    </Stack>
  )
}
