import { useEffect, useState } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Select,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader, m } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { primarySchoolKeyInfoMessages as kim } from '../../../../../lib/messages'
import { EducationPaths } from '../../../../../lib/paths'
import { SectionError } from '../SectionError'
import { useAgentRelationTypeOptions } from '../useKeyInfoOptions'
import { usePrimarySchoolKeyInfo } from '../usePrimarySchoolKeyInfo'

/**
 * Dedicated edit screen for a single aðstandandi (emergency contact).
 * (PrimarySchoolContactEdit). Only the relation type is editable (the contact's
 * name / national id are read-only). Save/cancel return to the overview.
 */
export const EmergencyContactEdit = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { studentId, agentId } = useParams<{
    studentId: string
    agentId: string
  }>()
  const { emergencyContacts, updateAgent, saving } =
    usePrimarySchoolKeyInfo(studentId)
  const { data: contacts, loading, error } = emergencyContacts

  const {
    options: relationOptions,
    loading: relationOptionsLoading,
    error: relationOptionsError,
  } = useAgentRelationTypeOptions()

  const contact = contacts?.find((item) => item.id === agentId)

  const [relationTypeId, setRelationTypeId] = useState<string | undefined>(
    contact?.relationTypeId,
  )

  // Prefill once the contact arrives from the data seam.
  useEffect(() => {
    setRelationTypeId(contact?.relationTypeId)
  }, [contact?.relationTypeId])

  const overviewPath = generatePath(EducationPaths.PrimarySchoolOverview, {
    studentId: studentId ?? '',
  })

  const handleSave = async () => {
    if (!agentId || !relationTypeId) return
    try {
      await updateAgent(agentId, { relationTypeId })
      toast.success(formatMessage(kim.saveSuccess))
      navigate(overviewPath)
    } catch {
      toast.error(formatMessage(kim.saveError))
    }
  }

  return (
    <>
      {loading && <CardLoader />}
      {!loading && error && <SectionError error={error} />}
      {!loading && !error && !contact && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
        />
      )}
      {!loading && !error && contact && (
        <Stack space={3}>
          <Box>
            <Text variant="small" fontWeight="semiBold" marginBottom={1}>
              {formatMessage(kim.contactName)}
            </Text>
            <Text variant="default">{contact.name}</Text>
          </Box>
          <GridRow>
            <GridColumn span={['1/1', '1/1', '1/1', '5/12']}>
              <Select
                name="relation-type"
                size="sm"
                label={formatMessage(kim.contactRelationType)}
                isLoading={relationOptionsLoading}
                options={relationOptions}
                value={
                  relationOptions.find(
                    (option) => option.value === relationTypeId,
                  ) ?? null
                }
                onChange={(option) =>
                  setRelationTypeId(option?.value ?? undefined)
                }
              />
            </GridColumn>
          </GridRow>
          {relationOptionsError && (
            <SectionError error={relationOptionsError} />
          )}
          <Box display="flex" columnGap={2}>
            <Button
              variant="primary"
              size="small"
              loading={saving}
              disabled={!relationTypeId}
              onClick={handleSave}
            >
              {formatMessage(kim.save)}
            </Button>
            <Button
              variant="ghost"
              size="small"
              disabled={saving}
              onClick={() => navigate(overviewPath)}
            >
              {formatMessage(kim.cancel)}
            </Button>
          </Box>
        </Stack>
      )}
    </>
  )
}

export default EmergencyContactEdit
