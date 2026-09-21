import { useState } from 'react'
import * as kennitala from 'kennitala'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Input,
  Select,
  Stack,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { primarySchoolKeyInfoMessages as kim } from '../../../../../lib/messages'
import { EducationPaths } from '../../../../../lib/paths'
import { SectionError } from '../SectionError'
import { useAgentRelationTypeOptions } from '../useKeyInfoOptions'
import { usePrimarySchoolKeyInfo } from '../usePrimarySchoolKeyInfo'

/**
 * Dedicated add screen for Aðstandendur (emergency contacts). Promoted from the
 * inline add form on the overview so adding is its own routed page
 * (PrimarySchoolContactAdd). Save/cancel return to the overview.
 *
 * Only the national id + relation type are entered — the contact's name is
 * resolved by MMS/Þjóðskrá from the national id. On success the added contact
 * gets a document in their mailbox to update their own contact details
 * (kim.contactMailboxNotice).
 */
export const EmergencyContactAdd = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { studentId } = useParams<{ studentId: string }>()
  const { addAgent, saving } = usePrimarySchoolKeyInfo(studentId)

  const {
    options: relationOptions,
    loading: relationOptionsLoading,
    error: relationOptionsError,
  } = useAgentRelationTypeOptions()

  const [nationalId, setNationalId] = useState('')
  const [relationTypeId, setRelationTypeId] = useState<string | undefined>(
    undefined,
  )

  const sanitizedNationalId = nationalId.replace(/\D/g, '')
  const nationalIdValid = kennitala.isValid(sanitizedNationalId)
  const canSubmit = nationalIdValid && !!relationTypeId

  const overviewPath = generatePath(EducationPaths.PrimarySchoolOverview, {
    studentId: studentId ?? '',
  })

  const handleSave = async () => {
    if (!canSubmit || !relationTypeId) return
    try {
      await addAgent({ nationalId: sanitizedNationalId, relationTypeId })
      toast.success(formatMessage(kim.saveSuccess))
      toast.success(formatMessage(kim.contactMailboxNotice))
      navigate(overviewPath)
    } catch {
      toast.error(formatMessage(kim.saveError))
    }
  }

  return (
    <Stack space={3}>
      <GridRow rowGap={[2, 2, 2, 'smallGutter']}>
        <GridColumn span={['1/1', '1/2', '1/2', '4/12']}>
          <Input
            name="new-contact-national-id"
            size="sm"
            type="tel"
            label={formatMessage(kim.contactNationalId)}
            value={nationalId}
            hasError={nationalId.length > 0 && !nationalIdValid}
            errorMessage={formatMessage(kim.contactNationalIdInvalid)}
            onChange={(event) => setNationalId(event.target.value)}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2', '1/2', '5/12']}>
          <Select
            name="new-contact-relation-type"
            size="sm"
            label={formatMessage(kim.contactRelationType)}
            isLoading={relationOptionsLoading}
            options={relationOptions}
            value={
              relationOptions.find(
                (option) => option.value === relationTypeId,
              ) ?? null
            }
            onChange={(option) => setRelationTypeId(option?.value ?? undefined)}
          />
        </GridColumn>
      </GridRow>
      {relationOptionsError && <SectionError error={relationOptionsError} />}
      <Box display="flex" columnGap={2}>
        <Button
          variant="primary"
          size="small"
          loading={saving}
          disabled={!canSubmit}
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
  )
}

export default EmergencyContactAdd
