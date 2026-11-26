import {
  AlertMessage,
  Box,
  Button,
  Divider,
  Icon,
  Text,
  useBreakpoint,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  InfoLine,
  IntroWrapper,
  m,
  MMS_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { sharedMessages } from '@island.is/shared/translations'
import { formatPhoneNumberWithIcelandicCountryCode } from '@island.is/shared/utils'
import { useNavigate } from 'react-router-dom'
import { educationOverviewMessages as om } from '../../lib/messages'
import { EducationPaths } from '../../lib/paths'
import { KeyInfoSection } from '../PrimarySchool/PrimarySchoolOverview/keyInfo/KeyInfoSection'
import { SectionError } from '../PrimarySchool/PrimarySchoolOverview/keyInfo/SectionError'
import {
  suggestOwnContact,
  toE164,
  useOwnContact,
  useProfileContact,
} from './useOwnContact'

export const EducationOverview = () => {
  useNamespaces(['sp.education-overview', 'sp.education-primary-school'])
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { sm } = useBreakpoint()
  const { contact, hasContact, loading, error } = useOwnContact()
  const { profile, loading: profileLoading } = useProfileContact()

  const goToEdit = () => navigate(EducationPaths.EducationOverviewContactEdit)
  const notRegistered = formatMessage(om.notRegistered)

  const renderContent = () => {
    if (loading || profileLoading) return <CardLoader />
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

    const { values, suggested } = suggestOwnContact(
      { phone: toE164(contact.phone ?? '') ?? '', email: contact.email ?? '' },
      profile,
    )

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
        {suggested.length > 0 && (
          <Box paddingY={2}>
            <AlertMessage
              type="warning"
              title={formatMessage(om.suggestedTitle)}
              message={formatMessage(om.suggestedOverviewMessage, {
                fields: suggested.length > 1 ? 'both' : suggested[0],
              })}
              action={
                <Button size="small" nowrap onClick={goToEdit}>
                  {formatMessage(om.registerButton)}
                </Button>
              }
            />
          </Box>
        )}
        {!hasContact && suggested.length === 0 && (
          <Box paddingY={2}>
            <AlertMessage
              type="info"
              title={formatMessage(om.registeredTitle)}
              message={formatMessage(om.registeredMessage)}
              action={
                <Button size="small" nowrap onClick={goToEdit}>
                  {formatMessage(om.registerButton)}
                </Button>
              }
            />
          </Box>
        )}
        <InfoLine
          label={m.telNumber}
          content={
            values.phone
              ? formatPhoneNumberWithIcelandicCountryCode(values.phone)
              : notRegistered
          }
          paddingY={3}
        />
        <Divider />
        <InfoLine
          label={m.email}
          content={values.email || notRegistered}
          paddingY={3}
        />
        <Divider />
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
