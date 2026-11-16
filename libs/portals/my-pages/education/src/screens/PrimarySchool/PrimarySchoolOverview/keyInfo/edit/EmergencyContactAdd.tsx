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
import { mmsErrorMessage } from '../mmsError'
import { focusInput, focusSelect } from './focusField'

/**
 * Dedicated add screen for Aðstandendur (emergency contacts).
 * Save/cancel return to the overview.
 *
 * The national id is entered; the contact's name is resolved from Þjóðskrá and
 * shown in a read-only field so the guardian can confirm the right person
 * before saving. Only the relation type is a free choice.
 */
export const EmergencyContactAdd = () => {
  useNamespaces('sp.education-primary-school')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { studentId } = useParams<{ studentId: string }>()
  // The screen shows no contacts, but it has to name the section it writes:
  // that is what the save refetches, so the overview reads the new contact from
  // the cache when it comes back. It does cost one read of its own — the hook
  // re-reads the section behind the cache the overview filled (see the
  // 'cache-and-network' fetch policy in usePrimarySchoolKeyInfo) — but nothing
  // on this screen waits for it.
  const { addAgent, saving } = usePrimarySchoolKeyInfo(studentId, [
    'emergencyContacts',
  ])

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

  // Validation is reported on save rather than by disabling it, so there is
  // always something to tell the guardian about what is missing.
  const [showErrors, setShowErrors] = useState(false)

  const sanitizedNationalId = nationalId.replace(/\D/g, '')
  const nationalIdValid = kennitala.isValid(sanitizedNationalId)
  const personNotFound =
    nationalIdValid && lookupCalled && !nameLoading && !name
  // The name must have resolved from Þjóðskrá before the contact can be saved.
  const nationalIdReady = nationalIdValid && !!name
  const canSubmit = nationalIdReady && !!relationTypeId

  const nationalIdError = () => {
    if (nationalId.length > 0 && !nationalIdValid)
      return formatMessage(kim.contactNationalIdInvalid)
    if (personNotFound) return formatMessage(kim.contactPersonNotFound)
    if (showErrors && !nationalIdReady) return formatMessage(kim.fieldRequired)
    return undefined
  }
  const nationalIdErrorMessage = nationalIdError()
  const relationTypeError = showErrors && !relationTypeId

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
    if (!canSubmit || !relationTypeId) {
      setShowErrors(true)
      if (!nationalIdReady) focusInput('new-contact-national-id')
      else focusSelect('new-contact-relation-type')
      return
    }
    try {
      await addAgent({ nationalId: sanitizedNationalId, relationTypeId })
      toast.success(formatMessage(kim.saveSuccess))
      navigate(overviewPath)
    } catch (error) {
      toast.error(formatMessage(mmsErrorMessage(error)))
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
            hasError={Boolean(nationalIdErrorMessage)}
            errorMessage={nationalIdErrorMessage}
            onChange={(event) => handleNationalIdChange(event.target.value)}
          />
          {/* The name resolves a moment after the national id is typed, so the
              result is announced rather than only shown. */}
          <Box aria-live="polite">
            {name && (
              <Box paddingTop={1} paddingLeft={2}>
                <Text variant="medium" fontWeight="semiBold">
                  {name}
                </Text>
              </Box>
            )}
          </Box>
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
          hasError={relationTypeError}
          errorMessage={
            relationTypeError ? formatMessage(kim.fieldRequired) : undefined
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
          <Button loading={saving} disabled={saving} onClick={handleSave}>
            {formatMessage(kim.confirm)}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

export default EmergencyContactAdd
