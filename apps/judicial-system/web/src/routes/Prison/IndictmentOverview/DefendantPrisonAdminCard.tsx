import {
  Box,
  Icon,
  Option,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  BlueBox,
  ContextMenu,
  IconButton,
} from '@island.is/judicial-system-web/src/components'
import {
  Defendant,
  PunishmentType,
} from '@island.is/judicial-system-web/src/graphql/schema'

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
  const isRegistered = defendant.isRegisteredInPrisonSystem === true
  const selectedPunishment = PUNISHMENT_TYPE_OPTIONS.find(
    (o) => o.value === defendant.punishmentType,
  )

  return (
    <Box marginBottom={3}>
      <BlueBox>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          marginBottom={2}
        >
          <Box display="flex" alignItems="center" columnGap={1}>
            <Text variant="h4" as="h4">
              {defendant.name}
            </Text>
            {isRegistered && (
              <Icon icon="checkmark" color="blue400" size="medium" />
            )}
          </Box>
          <ContextMenu
            items={[
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
            render={
              <IconButton
                icon="ellipsisVertical"
                colorScheme="transparent"
                onClick={(evt) => {
                  evt.stopPropagation()
                }}
              />
            }
          />
        </Box>
        <Text variant="eyebrow" marginBottom={1}>
          Fullnusta
        </Text>
        <Box marginBottom={2}>
          {defendant.verdict?.serviceDate && (
            <Box display="flex" alignItems="center" marginBottom={1}>
              <Text variant="small">
                {`\u2022 Dómur birtur ${formatDate(
                  defendant.verdict.serviceDate,
                  'PPP',
                )}`}
              </Text>
            </Box>
          )}
          {defendant.sentToPrisonAdminDate && (
            <Box display="flex" alignItems="center" marginBottom={1}>
              <Text variant="small">
                {`\u2022 Sent til fullnustu ${formatDate(
                  defendant.sentToPrisonAdminDate,
                  'PPP',
                )}`}
              </Text>
            </Box>
          )}
          {defendant.openedByPrisonAdminDate && (
            <Box display="flex" alignItems="center" marginBottom={1}>
              <Text variant="small">
                {`\u2022 Móttekið ${formatDate(
                  defendant.openedByPrisonAdminDate,
                  'PPP',
                )}`}
              </Text>
            </Box>
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
      </BlueBox>
    </Box>
  )
}
