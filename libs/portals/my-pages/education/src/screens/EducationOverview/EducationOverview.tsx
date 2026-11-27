import {
  AlertMessage,
  Box,
  Button,
  Icon,
  Input,
  PhoneInput,
  Stack,
  Text,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  m,
  MMS_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { sharedMessages } from '@island.is/shared/translations'
import { useNavigate } from 'react-router-dom'
import { educationOverviewMessages as om } from '../../lib/messages'
import { EducationPaths } from '../../lib/paths'
import * as styles from '../PrimarySchool/PrimarySchoolOverview/keyInfo/edit/editForm.css'
import { KeyInfoSection } from '../PrimarySchool/PrimarySchoolOverview/keyInfo/KeyInfoSection'
import { SectionError } from '../PrimarySchool/PrimarySchoolOverview/keyInfo/SectionError'
import { toE164, useOwnContact } from './useOwnContact'

export const EducationOverview = () => {
  useNamespaces(['sp.education-overview', 'sp.education-primary-school'])
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const { sm } = useBreakpoint()
  const { contact, hasContact, loading, error } = useOwnContact()

  const goToEdit = () => navigate(EducationPaths.EducationOverviewContactEdit)

  const renderContent = () => {
    if (loading) return <CardLoader />
    if (error) return <SectionError error={error} />
    if (!contact) {
      return (
        <Box marginTop={8}>
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(om.noData)}
            imgSrc="./assets/images/sofa.svg"
          />
        </Box>
      )
    }

    const phone = toE164(contact.phone ?? '')

    return (
      <KeyInfoSection
        title={om.contactTitle}
        action={
          hasContact && (
            <Button
              variant="text"
              icon="pencil"
              size="small"
              onClick={goToEdit}
            >
              {formatMessage(sm ? sharedMessages.edit : om.contactEditTitle)}
            </Button>
          )
        }
      >
        <Text paddingBottom={2}>{formatMessage(om.contactDescription)}</Text>
        {!hasContact && (
          <Box paddingY={2}>
            <AlertMessage
              type="info"
              title={formatMessage(om.registeredTitle)}
              message={formatMessage(om.registeredMessage)}
              action={
                <Button variant="text" size="small" nowrap onClick={goToEdit}>
                  {formatMessage(om.registerButton)}
                </Button>
              }
            />
          </Box>
        )}
        <Box className={styles.formContainer} paddingY={2}>
          <Stack space={3}>
            <PhoneInput
              name="overview-contact-phone"
              size="xs"
              locale={lang}
              label={formatMessage(m.telNumber)}
              value={phone ?? ''}
              readOnly
            />
            <Input
              name="overview-contact-email"
              type="email"
              size="xs"
              label={formatMessage(m.email)}
              value={contact.email ?? ''}
              readOnly
            />
          </Stack>
        </Box>
        <Box display="flex" alignItems="center" columnGap={1} paddingTop={2}>
          <Icon
            icon="informationCircle"
            type="outline"
            color="blue400"
            size="small"
          />
          <Text variant="small" color="dark400">
            {formatMessage(om.contactSource)}
          </Text>
        </Box>
      </KeyInfoSection>
    )
  }

  return (
    <IntroWrapper
      title={m.education}
      intro={om.intro}
      serviceProvider={{
        slug: MMS_SLUG,
        tooltip: formatMessage(m.mmsTooltip),
      }}
    >
      {renderContent()}
    </IntroWrapper>
  )
}

export default EducationOverview
