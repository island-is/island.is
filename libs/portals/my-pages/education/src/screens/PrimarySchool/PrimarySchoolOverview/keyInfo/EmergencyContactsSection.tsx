import { generatePath, useNavigate, useParams } from 'react-router-dom'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'
import { CardLoader } from '@island.is/portals/my-pages/core'
import { primarySchoolKeyInfoMessages as kim } from '../../../../lib/messages'
import { EducationPaths } from '../../../../lib/paths'
import { KeyInfoSection } from './KeyInfoSection'
import { SectionError } from './SectionError'
import type { EmergencyContact, MmsError } from './types'

interface Props {
  contacts: EmergencyContact[] | undefined
  loading: boolean
  error: MmsError | undefined
  /** true while any agent mutation is in flight */
  saving?: boolean
  /** Wired to the DELETE mutation — functional inline (no screen needed). */
  onRemove?: (agentId: string) => Promise<void>
}

/**
 * 1. Aðstandendur — GET /me/children/{childId}/emergency-contacts
 *
 * Read view per ticket: name, national id, relation type, and — only when
 * `createdBy.kind !== 'unknown'` — who registered it and (if present) the date.
 * Email / phone of the contact are never shown. Actions (Breyta / Fjarlægja)
 * appear only when MMS says `canEdit === true`; the frontend never computes this.
 *
 * Adding and editing live on their own routed screens (PrimarySchoolContactAdd /
 * PrimarySchoolContactEdit); only remove is handled inline here.
 */
export const EmergencyContactsSection = ({
  contacts,
  loading,
  error,
  saving,
  onRemove,
}: Props) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { studentId } = useParams<{ studentId: string }>()

  const addPath = generatePath(EducationPaths.PrimarySchoolContactAdd, {
    studentId: studentId ?? '',
  })
  const editPath = (agentId: string) =>
    generatePath(EducationPaths.PrimarySchoolContactEdit, {
      studentId: studentId ?? '',
      agentId,
    })

  const handleRemove = (contact: EmergencyContact) => onRemove?.(contact.id)
  const canEdit = (contact: EmergencyContact) => contact.canEdit === true

  const showRegisteredBy = (contact: EmergencyContact) =>
    contact.createdBy && contact.createdBy.kind !== 'unknown'

  return (
    <KeyInfoSection title={kim.emergencyContactsTitle}>
      <Divider />
      {loading && <CardLoader />}
      {!loading && error && <SectionError error={error} />}
      {!loading && !error && (!contacts || contacts.length === 0) && (
        <Text variant="default" color="dark400">
          {formatMessage(kim.contactsEmpty)}
        </Text>
      )}
      {!loading &&
        !error &&
        contacts?.map((contact, index) => (
          <Box key={contact.id}>
            {index > 0 && <Divider />}

            <Box paddingY={2}>
              <GridRow rowGap="smallGutter" alignItems="flexStart">
                <GridColumn span={['1/1', '1/1', '1/1', '4/12']}>
                  <Text variant="h5" as="span" lineHeight="lg">
                    {contact.name}
                  </Text>
                </GridColumn>
                <GridColumn span={['1/1', '1/1', '1/1', '5/12']}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    rowGap="smallGutter"
                  >
                    <Text variant="default">
                      {contact.relationTypeLabel ?? contact.relationTypeId}
                    </Text>
                    {showRegisteredBy(contact) && (
                      <Text variant="small" color="dark400">
                        {formatMessage(kim.contactRegisteredBy)}{' '}
                        {contact.createdBy?.name}
                        {contact.createdDate &&
                          ` · ${format(
                            new Date(contact.createdDate),
                            'd. MMMM yyyy',
                            { locale: is },
                          )}`}
                      </Text>
                    )}
                    {showRegisteredBy(contact) && !canEdit(contact) && (
                      <Text variant="small" color="dark400">
                        {formatMessage(kim.contactRegisteredNote)}
                      </Text>
                    )}
                  </Box>
                </GridColumn>
                <GridColumn span={['1/1', '1/1', '1/1', '3/12']}>
                  {canEdit(contact) && (
                    <Box
                      display="flex"
                      justifyContent={[
                        'flexStart',
                        'flexStart',
                        'flexStart',
                        'flexEnd',
                      ]}
                      columnGap={2}
                    >
                      <Button
                        variant="text"
                        size="small"
                        disabled={saving}
                        onClick={() => navigate(editPath(contact.id))}
                      >
                        {formatMessage(sharedMessages.edit)}
                      </Button>
                      <Button
                        variant="text"
                        colorScheme="destructive"
                        size="small"
                        disabled={saving}
                        onClick={() => handleRemove(contact)}
                      >
                        {formatMessage(kim.remove)}
                      </Button>
                    </Box>
                  )}
                </GridColumn>
              </GridRow>
            </Box>
          </Box>
        ))}
      <Divider />
      <Box display="flex" alignItems="center" columnGap={1} paddingTop={2}>
        <Icon
          icon="informationCircle"
          type="outline"
          color="blue400"
          size="small"
        />
        <Text variant="small" color="dark400">
          {formatMessage(kim.contactInfoNotice)}
        </Text>
      </Box>
      <Box paddingTop={2}>
        <Button
          variant="text"
          icon="add"
          size="small"
          onClick={() => navigate(addPath)}
        >
          {formatMessage(kim.contactAdd)}
        </Button>
      </Box>
    </KeyInfoSection>
  )
}

export default EmergencyContactsSection
