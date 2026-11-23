import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Input, Stack, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { CardLoader, IntroWrapper, m } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import {
  educationOverviewMessages as om,
  primarySchoolKeyInfoMessages as kim,
} from '../../lib/messages'
import { EducationPaths } from '../../lib/paths'
import * as styles from '../PrimarySchool/PrimarySchoolOverview/keyInfo/edit/editForm.css'
import { focusInput } from '../PrimarySchool/PrimarySchoolOverview/keyInfo/edit/focusField'
import { mmsErrorMessage } from '../PrimarySchool/PrimarySchoolOverview/keyInfo/mmsError'
import { SectionError } from '../PrimarySchool/PrimarySchoolOverview/keyInfo/SectionError'
import {
  ownContactFieldErrors,
  useOwnContact,
  type OwnContactField,
} from './useOwnContact'

const FIELD_INPUT: Record<OwnContactField, string> = {
  phone: 'contact-phone',
  email: 'contact-email',
}

export const ContactEdit = () => {
  useNamespaces(['sp.education-overview', 'sp.education-primary-school'])
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { contact, loading, error, saving, save } = useOwnContact()

  const storedPhone = contact?.phone ?? ''
  const storedEmail = contact?.email ?? ''

  const [phone, setPhone] = useState(storedPhone)
  const [email, setEmail] = useState(storedEmail)
  const [fieldErrors, setFieldErrors] = useState<OwnContactField[]>([])

  useEffect(() => {
    setPhone(storedPhone)
    setEmail(storedEmail)
  }, [storedPhone, storedEmail])

  const isDirty = phone !== storedPhone || email !== storedEmail

  const goBack = () => navigate(EducationPaths.EducationOverview)

  const handleSave = async () => {
    setFieldErrors([])
    try {
      await save({ phone, email })
      toast.success(formatMessage(kim.saveSuccess))
      goBack()
    } catch (saveError) {
      const fields = ownContactFieldErrors(saveError)
      if (fields.length > 0) {
        setFieldErrors(fields)
        focusInput(FIELD_INPUT[fields[0]])
        return
      }
      toast.error(formatMessage(mmsErrorMessage(saveError)))
    }
  }

  const renderContent = () => {
    if (loading) return <CardLoader />
    if (error) return <SectionError error={error} />
    if (!contact) {
      return (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
        />
      )
    }

    const phoneError = fieldErrors.includes('phone')
    const emailError = fieldErrors.includes('email')

    return (
      <Box className={styles.formContainer}>
        <Stack space={3}>
          <Input
            backgroundColor="blue"
            name={FIELD_INPUT.phone}
            type="tel"
            size="sm"
            label={formatMessage(m.telNumber)}
            value={phone}
            hasError={phoneError}
            errorMessage={
              phoneError ? formatMessage(om.phoneInvalid) : undefined
            }
            onChange={(event) => setPhone(event.target.value)}
          />
          <Input
            backgroundColor="blue"
            name={FIELD_INPUT.email}
            type="email"
            size="sm"
            label={formatMessage(m.email)}
            value={email}
            hasError={emailError}
            errorMessage={
              emailError ? formatMessage(om.emailInvalid) : undefined
            }
            onChange={(event) => setEmail(event.target.value)}
          />
          <Box display="flex" justifyContent="flexEnd" columnGap={2}>
            <Button
              variant="ghost"
              size="small"
              disabled={saving}
              onClick={goBack}
            >
              {formatMessage(kim.cancel)}
            </Button>
            <Button
              size="small"
              loading={saving}
              disabled={!isDirty}
              onClick={handleSave}
            >
              {formatMessage(kim.confirm)}
            </Button>
          </Box>
        </Stack>
      </Box>
    )
  }

  return (
    <IntroWrapper title={om.contactEditTitle} intro={om.contactDescription}>
      {renderContent()}
    </IntroWrapper>
  )
}

export default ContactEdit
