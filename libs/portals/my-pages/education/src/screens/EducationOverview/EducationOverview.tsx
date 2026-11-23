import {
  AlertMessage,
  Box,
  Button,
  Divider,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  InfoLine,
  IntroWrapper,
  m,
  MMS_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { sharedMessages } from '@island.is/shared/translations'
import { educationOverviewMessages as om } from '../../lib/messages'
import { useNavigate } from 'react-router-dom'
import { EducationPaths } from '../../lib/paths'
import { KeyInfoSection } from '../PrimarySchool/PrimarySchoolOverview/keyInfo/KeyInfoSection'
import { MOCK_CONTACT, MOCK_REGISTERED_BY } from './mockContact'

const NO_DATA = false
const HAS_CONTACT = false

export const EducationOverview = () => {
  useNamespaces('sp.education-overview')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const goToEdit = () => navigate(EducationPaths.EducationOverviewContactEdit)
  const notRegistered = formatMessage(om.notRegistered)

  return (
    <IntroWrapper
      title={m.education}
      intro={om.intro}
      serviceProvider={{
        slug: MMS_SLUG,
        tooltip: formatMessage(m.mmsTooltip),
      }}
    >
      {NO_DATA ? (
        <Box marginTop={8}>
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(om.noData)}
            imgSrc="./assets/images/sofa.svg"
          />
        </Box>
      ) : (
        <KeyInfoSection
          title={om.contactTitle}
          action={
            HAS_CONTACT && (
              <Button
                variant="text"
                icon="pencil"
                size="small"
                onClick={goToEdit}
              >
                {formatMessage(sharedMessages.edit)}
              </Button>
            )
          }
        >
          <Text paddingBottom={2}>{formatMessage(om.contactDescription)}</Text>
          {!HAS_CONTACT && (
            <Box paddingY={2}>
              <AlertMessage
                type="info"
                title={formatMessage(om.registeredTitle)}
                message={formatMessage(om.registeredMessage, {
                  name: MOCK_REGISTERED_BY,
                })}
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
            content={HAS_CONTACT ? MOCK_CONTACT.phone : notRegistered}
            paddingY={3}
          />
          <Divider />
          <InfoLine
            label={m.email}
            content={HAS_CONTACT ? MOCK_CONTACT.email : notRegistered}
            paddingY={3}
          />
          <Divider />
          <InfoLine
            label={om.communicationLanguage}
            content={HAS_CONTACT ? MOCK_CONTACT.language : notRegistered}
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
      )}
    </IntroWrapper>
  )
}

export default EducationOverview
