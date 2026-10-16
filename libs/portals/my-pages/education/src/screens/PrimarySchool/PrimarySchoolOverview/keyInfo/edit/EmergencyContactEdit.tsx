import { useEffect, useState } from 'react'
import * as kennitala from 'kennitala'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
  Select,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader, m } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import * as styles from './editForm.css'
import { primarySchoolKeyInfoMessages as kim } from '../../../../../lib/messages'
import { EducationPaths } from '../../../../../lib/paths'
import { SectionError } from '../SectionError'
import { useAgentRelationTypeOptions } from '../useKeyInfoOptions'
import { usePrimarySchoolKeyInfo } from '../usePrimarySchoolKeyInfo'

/**
 * Dedicated edit screen for a single aðstandandi (emergency contact).
 * (PrimarySchoolContactEdit). Mirrors the add screen's layout: the national id
 * and name are shown read-only (both come from the existing record / Þjóðskrá)
 * and only the relation type is editable. Save/cancel return to the overview.
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

  // Only the relation type is editable, so the form is dirty once it differs
  // from the loaded contact. Save stays disabled until then.
  const isDirty = relationTypeId !== contact?.relationTypeId

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
        <Box className={styles.formContainer}>
          <Stack space={3}>
            <Box>
              <Input
                backgroundColor="blue"
                name="contact-national-id"
                type="tel"
                readOnly
                label={formatMessage(kim.contactNationalId)}
                value={kennitala.format(contact.nationalId)}
              />
              <Box paddingTop={1} paddingLeft={2}>
                <Text variant="medium" fontWeight="semiBold">
                  {contact.name}
                </Text>
              </Box>
            </Box>
            <Select
              name="relation-type"
              required
              backgroundColor="blue"
              label={formatMessage(kim.contactRelationPrompt)}
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
            {relationOptionsError && (
              <SectionError error={relationOptionsError} />
            )}
            <Box display="flex" justifyContent="flexEnd" columnGap={2}>
              <Button
                variant="ghost"
                disabled={saving}
                onClick={() => navigate(overviewPath)}
              >
                {formatMessage(kim.cancel)}
              </Button>
              <Button
                loading={saving}
                disabled={!relationTypeId || !isDirty}
                onClick={handleSave}
              >
                {formatMessage(kim.confirm)}
              </Button>
            </Box>
          </Stack>
        </Box>
      )}
    </>
  )
}

export default EmergencyContactEdit
