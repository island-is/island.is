import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
  PhoneInput,
  Stack,
  toast,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  m,
  Modal,
} from '@island.is/portals/my-pages/core'
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
  clearedOwnContactFields,
  ownContactFieldErrors,
  toE164,
  useOwnContact,
  type OwnContactField,
  type OwnContactInput,
} from './useOwnContact'

const FIELD_INPUT: Record<OwnContactField, string> = {
  phone: 'contact-phone',
  email: 'contact-email',
}

interface ContactFormProps {
  stored: OwnContactInput
  saving: boolean
  save: (input: OwnContactInput) => Promise<void>
  onDone: () => void
}

const ContactForm = ({ stored, saving, save, onDone }: ContactFormProps) => {
  const { formatMessage, lang } = useLocale()
  const [phone, setPhone] = useState(stored.phone)
  const [email, setEmail] = useState(stored.email)
  const [fieldErrors, setFieldErrors] = useState<OwnContactField[]>([])
  const [confirmClear, setConfirmClear] = useState(false)
  const saveButton = useRef<HTMLButtonElement>(null)

  const isDirty = phone !== stored.phone || email !== stored.email
  const clearedFields = clearedOwnContactFields(stored, { phone, email })

  const handleSubmit = () => {
    if (clearedFields.length > 0) {
      setConfirmClear(true)
      return
    }
    handleSave()
  }

  const closeClearModal = () => {
    setConfirmClear(false)
    saveButton.current?.focus()
  }

  const handleSave = async () => {
    setFieldErrors([])
    try {
      await save({ phone, email })
      toast.success(formatMessage(kim.saveSuccess))
      onDone()
    } catch (saveError) {
      setConfirmClear(false)
      const fields = ownContactFieldErrors(saveError)
      if (fields.length > 0) {
        setFieldErrors(fields)
        focusInput(FIELD_INPUT[fields[0]])
        return
      }
      toast.error(formatMessage(mmsErrorMessage(saveError)))
    }
  }

  const phoneError = fieldErrors.includes('phone')
  const emailError = fieldErrors.includes('email')

  return (
    <Box className={styles.formContainer}>
      <Stack space={3}>
        <PhoneInput
          backgroundColor="blue"
          name={FIELD_INPUT.phone}
          size="sm"
          locale={lang}
          label={formatMessage(m.telNumber)}
          value={phone}
          errorMessage={phoneError ? formatMessage(om.phoneInvalid) : undefined}
          onFormatValueChange={(value?: string) => setPhone(value ?? '')}
        />
        <Input
          backgroundColor="blue"
          name={FIELD_INPUT.email}
          type="email"
          size="sm"
          label={formatMessage(m.email)}
          value={email}
          hasError={emailError}
          errorMessage={emailError ? formatMessage(om.emailInvalid) : undefined}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Box display="flex" justifyContent="flexEnd" columnGap={2}>
          <Button
            variant="ghost"
            size="small"
            disabled={saving}
            onClick={onDone}
          >
            {formatMessage(kim.cancel)}
          </Button>
          <Button
            ref={saveButton}
            size="small"
            loading={saving}
            disabled={!isDirty}
            onClick={handleSubmit}
          >
            {formatMessage(kim.confirm)}
          </Button>
        </Box>
      </Stack>
      {confirmClear && (
        <Modal
          id="education-contact-clear-modal"
          isVisible
          initialVisibility
          buttonsSpacing="spaceBetween"
          onCloseModal={closeClearModal}
          title={formatMessage(om.clearTitle)}
          text={formatMessage(om.clearText, {
            fields: clearedFields.length > 1 ? 'both' : clearedFields[0],
          })}
          buttons={[
            {
              id: 'education-contact-clear-cancel',
              type: 'ghost',
              text: formatMessage(kim.cancel),
              onClick: closeClearModal,
            },
            {
              id: 'education-contact-clear-confirm',
              type: 'primary',
              text: formatMessage(kim.confirm),
              loading: saving,
              onClick: handleSave,
            },
          ]}
        />
      )}
    </Box>
  )
}

export const ContactEdit = () => {
  useNamespaces(['sp.education-overview', 'sp.education-primary-school'])
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { contact, loading, error, saving, save } = useOwnContact()

  const goBack = () => navigate(EducationPaths.EducationOverview)

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

    return (
      <ContactForm
        stored={{
          phone: toE164(contact.phone ?? '') ?? '',
          email: contact.email ?? '',
        }}
        saving={saving}
        save={save}
        onDone={goBack}
      />
    )
  }

  return (
    <IntroWrapper title={om.contactEditTitle} intro={om.contactDescription}>
      {renderContent()}
    </IntroWrapper>
  )
}

export default ContactEdit
