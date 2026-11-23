import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Input, Stack, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { IntroWrapper, m } from '@island.is/portals/my-pages/core'
import {
  educationOverviewMessages as om,
  primarySchoolKeyInfoMessages as kim,
} from '../../lib/messages'
import { EducationPaths } from '../../lib/paths'
import * as styles from '../PrimarySchool/PrimarySchoolOverview/keyInfo/edit/editForm.css'
import { MOCK_CONTACT } from './mockContact'

export const ContactEdit = () => {
  useNamespaces(['sp.education-overview', 'sp.education-primary-school'])
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const [phone, setPhone] = useState(MOCK_CONTACT.phone)
  const [email, setEmail] = useState(MOCK_CONTACT.email)

  const isDirty = phone !== MOCK_CONTACT.phone || email !== MOCK_CONTACT.email

  const goBack = () => navigate(EducationPaths.EducationOverview)

  const handleSave = () => {
    toast.success(formatMessage(kim.saveSuccess))
    goBack()
  }

  return (
    <IntroWrapper title={om.contactEditTitle} intro={om.contactDescription}>
      <Box className={styles.formContainer}>
        <Stack space={3}>
          <Input
            backgroundColor="blue"
            name="contact-phone"
            type="tel"
            label={formatMessage(m.telNumber)}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <Input
            backgroundColor="blue"
            name="contact-email"
            type="email"
            label={formatMessage(m.email)}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Box display="flex" justifyContent="flexEnd" columnGap={2}>
            <Button variant="ghost" onClick={goBack}>
              {formatMessage(kim.cancel)}
            </Button>
            <Button disabled={!isDirty} onClick={handleSave}>
              {formatMessage(kim.confirm)}
            </Button>
          </Box>
        </Stack>
      </Box>
    </IntroWrapper>
  )
}

export default ContactEdit
