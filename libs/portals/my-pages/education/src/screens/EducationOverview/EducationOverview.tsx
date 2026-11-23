import { Box, Button, Divider, Icon, Text } from '@island.is/island-ui/core'
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
import { MOCK_CONTACT } from './mockContact'

const NO_DATA = false

export const EducationOverview = () => {
  useNamespaces('sp.education-overview')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

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
            <Button
              variant="text"
              icon="pencil"
              size="small"
              onClick={() =>
                navigate(EducationPaths.EducationOverviewContactEdit)
              }
            >
              {formatMessage(sharedMessages.edit)}
            </Button>
          }
        >
          <Text paddingBottom={2}>{formatMessage(om.contactDescription)}</Text>
          <InfoLine
            label={m.telNumber}
            content={MOCK_CONTACT.phone}
            paddingY={3}
          />
          <Divider />
          <InfoLine label={m.email} content={MOCK_CONTACT.email} paddingY={3} />
          <Divider />
          <InfoLine
            label={om.communicationLanguage}
            content={MOCK_CONTACT.language}
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
