import { Box, Icon, Option, Select, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import ContextMenuCard from '@island.is/judicial-system-web/src/components/Cards/ContextMenuCard/ContextMenuCard'
import {
  Defendant,
  PunishmentType,
  ServiceRequirement,
  VerdictAppealDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

const getDefendantExplanation = (defendant: Defendant): string => {
  if (
    defendant.verdict?.serviceRequirement === ServiceRequirement.REQUIRED &&
    !defendant.verdict?.serviceDate
  ) {
    return 'Dómur er í birtingarferli'
  }

  if (
    defendant.verdict?.appealDecision === VerdictAppealDecision.POSTPONE ||
    defendant.verdict?.appealDate
  ) {
    return 'Áfrýjun'
  }

  return 'Ekki sent til fullnustu'
}

const PUNISHMENT_TYPE_OPTIONS: Option<PunishmentType>[] = [
  { label: 'Óskilorðsbundið', value: PunishmentType.IMPRISONMENT },
  { label: 'Skilorðsbundið', value: PunishmentType.PROBATION },
  { label: 'Sekt', value: PunishmentType.FINE },
  {
    label: 'Viðurlagaákvörðun',
    value: PunishmentType.INDICTMENT_RULING_DECISION_FINE,
  },
  { label: 'Áritað sektarboð', value: PunishmentType.SIGNED_FINE_INVITATION },
  { label: 'Annað', value: PunishmentType.OTHER },
]

export interface DefendantPrisonAdminCardProps {
  defendant: Defendant
  onToggleRegistration: (defendant: Defendant) => void
  onPunishmentTypeChange: (
    defendant: Defendant,
    option: Option<PunishmentType> | null,
  ) => void
}

export const DefendantPrisonAdminCard = ({
  defendant,
  onToggleRegistration,
  onPunishmentTypeChange,
}: DefendantPrisonAdminCardProps) => {
  const isSentToPrisonAdmin = defendant.isSentToPrisonAdmin

  if (!isSentToPrisonAdmin) {
    return (
      <Box marginBottom={3}>
        <BlueBox>
          <Text variant="h4" as="h4" marginBottom={1}>
            {defendant.name}
          </Text>
          <Box as="ul" marginTop={1}>
            <Text as="span">{getDefendantExplanation(defendant)}</Text>
          </Box>
        </BlueBox>
      </Box>
    )
  }

  const isRegistered = defendant.isRegisteredInPrisonSystem === true
  const selectedPunishment = PUNISHMENT_TYPE_OPTIONS.find(
    (o) => o.value === defendant.punishmentType,
  )

  return (
    <Box marginBottom={3}>
      <ContextMenuCard
        title={
          <Box display="flex" alignItems="center" columnGap={1}>
            <Text variant="h4" as="h4">
              {defendant.name}
            </Text>
            {isRegistered && (
              <Icon icon="checkmark" color="blue400" size="medium" />
            )}
          </Box>
        }
        contextMenuItems={[
          isRegistered
            ? {
                title: 'Afskrá dóm',
                icon: 'close',
                onClick: () => onToggleRegistration(defendant),
              }
            : {
                title: 'Dómur skráður',
                icon: 'checkmark',
                onClick: () => onToggleRegistration(defendant),
              },
        ]}
      >
        <Text variant="eyebrow" marginBottom={1}>
          Fullnusta
        </Text>
        <Box as="ul" marginLeft={2} marginBottom={2}>
          {defendant.verdict?.serviceDate && (
            <li>
              <Text as="span">
                Dómur birtur {formatDate(defendant.verdict.serviceDate, 'PPP')}
              </Text>
            </li>
          )}
          {defendant.sentToPrisonAdminDate && (
            <li>
              <Text as="span">
                Sent til fullnustu{' '}
                {formatDate(defendant.sentToPrisonAdminDate, 'PPP')}
              </Text>
            </li>
          )}
          {defendant.openedByPrisonAdminDate && (
            <li>
              <Text as="span">
                Móttekið {formatDate(defendant.openedByPrisonAdminDate, 'PPP')}
              </Text>
            </li>
          )}
        </Box>
        <Select
          name={`punishmentType-${defendant.id}`}
          label="Refsitegund"
          placeholder="Veldu refsitegund"
          options={PUNISHMENT_TYPE_OPTIONS}
          value={selectedPunishment ?? null}
          onChange={(option) =>
            onPunishmentTypeChange(
              defendant,
              option as Option<PunishmentType> | null,
            )
          }
          size="sm"
        />
      </ContextMenuCard>
    </Box>
  )
}
