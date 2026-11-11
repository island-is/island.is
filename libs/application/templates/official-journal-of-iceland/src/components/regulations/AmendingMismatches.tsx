/**
 * Warns about possible mismatches between the amending regulation's text
 * and the changes recorded on the base regulations (see
 * `getAmendingMismatches`). Amounts and dates come first, being the likeliest
 * slips; wording follows, grouped and capped, since a rewritten passage can
 * give many. Never blocks submitting: the user decides.
 */
import {
  AlertMessage,
  Bullet,
  BulletList,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useMemo } from 'react'
import { RegulationImpactSchema } from '../../lib/dataSchema'
import { regulation } from '../../lib/messages'
import {
  Addition,
  getAmendingMismatches,
  MismatchPlace,
} from '../../utils/amendingMismatches'

/** How many amounts and dates, wording groups, and texts per group to show */
const MAX_VALUES = 10
const MAX_GROUPS = 5
const MAX_TEXTS = 3
/** A long passage is cut, to keep the list readable */
const MAX_LENGTH = 120

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1)

const shorten = (text: string) =>
  text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH).trimEnd()}…` : text

type AmendingMismatchesProps = {
  impacts: RegulationImpactSchema[]
  /** Base64-encoded advert HTML */
  html?: string
  /** The advert's appendixes, content base64-encoded */
  additions?: Addition[]
}

export const AmendingMismatches = ({
  impacts,
  html,
  additions,
}: AmendingMismatchesProps) => {
  const { formatMessage: f } = useLocale()
  const msg = regulation.content.mismatches

  const result = useMemo(() => {
    try {
      return getAmendingMismatches({ html, additions, impacts })
    } catch (error) {
      // A hint, so a failure must not break the screen
      console.error('Failed to check the amending text for mismatches', error)
      return undefined
    }
  }, [html, additions, impacts])

  // Shown, so a failed check isn't taken for one that found nothing
  if (!result) {
    return (
      <AlertMessage
        type="warning"
        title={f(msg.failedTitle)}
        message={f(msg.failed)}
      />
    )
  }
  const { values, wording } = result
  if (!values.length && !wording.length) {
    return null
  }

  const placeOf = ({ regulation: reg, appendix, section }: MismatchPlace) =>
    appendix
      ? f(msg.placeAppendix, { appendix, regulation: reg })
      : section
      ? f(msg.placeSection, { section, regulation: reg })
      : f(msg.placeRegulation, { regulation: reg })

  const more = (count: number) =>
    count > 0 ? ` ${f(msg.more, { count })}` : ''

  return (
    <AlertMessage
      type="warning"
      title={f(msg.title)}
      message={
        <Stack space={2}>
          <Text variant="small">{f(msg.intro)}</Text>
          {values.length > 0 && (
            <BulletList color="black">
              {values.slice(0, MAX_VALUES).map((v, i) => (
                <Bullet key={i}>
                  {v.type === 'missingFromText'
                    ? f(msg.missingFromText, {
                        text: v.text,
                        place: placeOf(v.place),
                      })
                    : v.section
                    ? f(msg.notInChanges, { text: v.text, section: v.section })
                    : f(msg.notInChangesNoSection, { text: v.text })}
                </Bullet>
              ))}
              {values.length > MAX_VALUES && (
                <Bullet>
                  {f(msg.more, { count: values.length - MAX_VALUES })}
                </Bullet>
              )}
            </BulletList>
          )}
          {wording.length > 0 && (
            <>
              <Text variant="small" fontWeight="semiBold">
                {f(msg.wordingHeading)}
              </Text>
              <BulletList color="black">
                {wording.slice(0, MAX_GROUPS).map((group, i) => (
                  <Bullet key={i}>
                    {`${capitalize(placeOf(group.place))}: ${group.texts
                      .slice(0, MAX_TEXTS)
                      .map((t) => `„${shorten(t)}“`)
                      .join(', ')}${more(group.texts.length - MAX_TEXTS)}`}
                  </Bullet>
                ))}
                {wording.length > MAX_GROUPS && (
                  <Bullet>
                    {f(msg.more, { count: wording.length - MAX_GROUPS })}
                  </Bullet>
                )}
              </BulletList>
            </>
          )}
        </Stack>
      }
    />
  )
}
