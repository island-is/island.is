import { useState } from 'react'
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
import * as styles from './editForm.css'
import { primarySchoolKeyInfoMessages as kim } from '../../../../../lib/messages'
import { EducationPaths } from '../../../../../lib/paths'
import { usePrimarySchoolContactIdentityLazyQuery } from '../PrimarySchoolKeyInfo.generated'
import { SectionError } from '../SectionError'
import { useAgentRelationTypeOptions } from '../useKeyInfoOptions'
import { usePrimarySchoolKeyInfo } from '../usePrimarySchoolKeyInfo'

/**
 * Dedicated add screen for Aðstandendur (emergency contacts).
 * Save/cancel return to the overview.
 *
 * The national id is entered; the contact's name is resolved from Þjóðskrá and
 * shown in a read-only field so the guardian can confirm the right person
 * before saving. Only the relation type is a free choice. On success the added
 * contact gets a document in their mailbox to update their own contact details
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
  const [name, setName] = useState('')
  const [relationTypeId, setRelationTypeId] = useState<string | undefined>(
    undefined,
  )

  const [lookupIdentity, { loading: nameLoading, called: lookupCalled }] =
    usePrimarySchoolContactIdentityLazyQuery({
      fetchPolicy: 'no-cache',
      onCompleted: (data) => setName(data.identity?.name ?? ''),
      onError: () => setName(''),
    })

  const sanitizedNationalId = nationalId.replace(/\D/g, '')
  const nationalIdValid = kennitala.isValid(sanitizedNationalId)
  // The name must have resolved from Þjóðskrá before the contact can be saved.
  const canSubmit = nationalIdValid && !!name && !!relationTypeId

  const overviewPath = generatePath(EducationPaths.PrimarySchoolOverview, {
    studentId: studentId ?? '',
  })

  const handleNationalIdChange = (value: string) => {
    setNationalId(value)
    // Any edit invalidates the previously resolved name.
    setName('')
    const sanitized = value.replace(/\D/g, '')
    if (kennitala.isValid(sanitized)) {
      lookupIdentity({ variables: { input: { nationalId: sanitized } } })
    }
  }

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
    <Box className={styles.formContainer}>
      <Stack space={3}>
        <Box>
          <Input
            name="new-contact-national-id"
            type="tel"
            backgroundColor="blue"
            icon={{ name: 'search' }}
            loading={nameLoading}
            label={formatMessage(kim.contactNationalId)}
            value={nationalId}
            hasError={nationalId.length > 0 && !nationalIdValid}
            errorMessage={formatMessage(kim.contactNationalIdInvalid)}
            onChange={(event) => handleNationalIdChange(event.target.value)}
          />
          {name && (
            <Box paddingTop={1} paddingLeft={2}>
              <Text variant="medium" fontWeight="semiBold">
                {name}
              </Text>
            </Box>
          )}
          {nationalIdValid && lookupCalled && !nameLoading && !name && (
            <Box paddingTop={1} paddingLeft={2}>
              <Text variant="small" color="red600">
                {formatMessage(kim.contactPersonNotFound)}
              </Text>
            </Box>
          )}
        </Box>
        <Select
          name="new-contact-relation-type"
          backgroundColor="blue"
          required
          label={formatMessage(kim.contactRelationPrompt)}
          isLoading={relationOptionsLoading}
          options={relationOptions}
          value={
            relationOptions.find((option) => option.value === relationTypeId) ??
            null
          }
          onChange={(option) => setRelationTypeId(option?.value ?? undefined)}
        />
        {relationOptionsError && <SectionError error={relationOptionsError} />}
        <Box display="flex" justifyContent="flexEnd" columnGap={2}>
          <Button
            variant="ghost"
            disabled={saving}
            onClick={() => navigate(overviewPath)}
          >
            {formatMessage(kim.cancel)}
          </Button>
          <Button loading={saving} disabled={!canSubmit} onClick={handleSave}>
            {formatMessage(kim.confirm)}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

export default EmergencyContactAdd
