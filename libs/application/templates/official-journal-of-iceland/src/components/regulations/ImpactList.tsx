/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/ImpactList.tsx
 *
 * Displays a list of all registered impacts (amendments + cancellations)
 * grouped by target regulation name.
 *
 * Key adaptations:
 * - No GraphQL mutations for delete — uses onDelete callback
 * - Uses RegulationImpactSchema instead of DraftImpactForm
 * - Opens EditChange/EditCancellation modals via local state
 * - No document.location.reload() — parent refreshes through state
 */
import { useCallback, useEffect, useState } from 'react'
import {
  ActionCard,
  AlertMessage,
  Box,
  DialogPrompt,
  Divider,
  Icon,
  Stack,
  Tag,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { prettyName, RegName } from '@island.is/regulations'
import { RegulationImpactSchema } from '../../lib/dataSchema'
import { EditCancellation } from './EditCancellation'
import { EditChange } from './EditChange'

// ---------------------------------------------------------------------------

export type ImpactListProps = {
  /** All impacts from answers.regulation.impacts[], grouped by name */
  groupedImpacts: Record<string, RegulationImpactSchema[]>
  /** Title of the parent regulation/draft */
  draftTitle?: string
  /** HTML body of the draft regulation (for reference panel) */
  draftHtml?: string
  /** Whether the parent regulation is a base type */
  isBase?: boolean
  /** Application ID needed for file uploads in the editor */
  applicationId: string
  /** Custom title for the list */
  title?: string | JSX.Element
  /** Custom title when list is empty */
  titleEmpty?: string | JSX.Element
  /** Callback to save an updated impact */
  onSaveImpact: (impact: RegulationImpactSchema) => void
  /** Callback to delete an impact */
  onDeleteImpact: (id: string) => void
}

export const ImpactList = (props: ImpactListProps) => {
  const {
    groupedImpacts,
    draftTitle,
    draftHtml,
    isBase,
    applicationId,
    title,
    titleEmpty,
    onSaveImpact,
    onDeleteImpact,
  } = props

  const { formatDateFns } = useLocale()

  const [editing, setEditing] = useState<{
    impact: RegulationImpactSchema
    readonly: boolean
  } | null>(null)

  const escClick = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditing(null)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escClick, false)
    return () => {
      document.removeEventListener('keydown', escClick, false)
    }
  }, [escClick])

  const closeModal = () => {
    setEditing(null)
  }

  const handleSave = (impact: RegulationImpactSchema) => {
    onSaveImpact(impact)
    setEditing(null)
  }

  const impactKeys = Object.keys(groupedImpacts)

  return !impactKeys.length ? (
    <Text variant="h3" as="h3">
      {titleEmpty || 'Engar áhrifafærslur skráðar'}
    </Text>
  ) : (
    <Stack space={3}>
      <Text variant="h3" as="h3">
        {title || 'Skráðar áhrifafærslur'}
      </Text>
      {impactKeys.map((impGrp, i) => {
        const impactGroup = groupedImpacts[impGrp]
        return (
          <Stack space={3} key={impGrp + '-' + i}>
            <Text variant="h4" as="h4" marginTop={i === 0 ? 0 : 5}>
              {impGrp === 'self'
                ? 'Hefur áhrif á sjálfa sig'
                : `Breytingar á ${prettyName(impGrp as RegName)}`}
            </Text>
            {impactGroup.map((impact, idx) => {
              const { id, name, regTitle, type, date } = impact
              const isChange = type === 'amend'
              const headingText =
                name === 'self'
                  ? draftTitle || ''
                  : `${prettyName(name as RegName)} – ${regTitle || ''}`

              return (
                <ActionCard
                  key={id}
                  date={
                    date
                      ? formatDateFns(new Date(date), 'd. MMM yyyy')
                      : undefined
                  }
                  heading={headingText}
                  tag={{
                    label: isChange ? 'Textabreyting' : 'Brottfelling',
                    variant: isChange ? 'blueberry' : 'red',
                    renderTag: (child) => (
                      <Box display="flex" columnGap={1}>
                        {child}
                        {idx === impactGroup.length - 1 ? (
                          <DialogPrompt
                            baseId={`delete_dialog_${id}`}
                            title="Eyða"
                            description="Ertu viss um að þú viljir eyða þessari skráningu?"
                            ariaLabel="delete"
                            disclosureElement={
                              <Tag
                                outlined
                                variant={isChange ? 'blueberry' : 'red'}
                              >
                                <VisuallyHidden>Eyða</VisuallyHidden>
                                <Box
                                  display="flex"
                                  flexDirection="row"
                                  alignItems="center"
                                >
                                  <Icon
                                    icon="trash"
                                    size="small"
                                    type="outline"
                                    ariaHidden
                                  />
                                </Box>
                              </Tag>
                            }
                            onConfirm={() => {
                              onDeleteImpact(id)
                            }}
                            buttonTextConfirm="Eyða"
                            buttonTextCancel="Hætta við"
                          />
                        ) : null}
                      </Box>
                    ),
                  }}
                  cta={{
                    icon: undefined,
                    label:
                      idx !== impactGroup.length - 1
                        ? 'Skoða'
                        : 'Skoða / breyta',
                    variant: 'ghost',
                    onClick: () => {
                      setEditing({
                        impact,
                        readonly: idx !== impactGroup.length - 1,
                      })
                    },
                  }}
                />
              )
            })}
          </Stack>
        )
      })}

      {editing?.impact?.type === 'repeal' && (
        <EditCancellation
          cancellation={editing.impact}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
      {editing?.impact?.type === 'amend' && (
        <EditChange
          change={editing.impact}
          draftTitle={draftTitle}
          draftHtml={draftHtml}
          isBase={isBase}
          applicationId={applicationId}
          readOnly={editing.readonly}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </Stack>
  )
}
