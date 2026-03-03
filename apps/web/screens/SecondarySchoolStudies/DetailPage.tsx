import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'

import { Box, GridContainer, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { HeadWithSocialSharing } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  SecondarySchoolProgrammeByIdQuery,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { withCustomPageWrapper } from '../CustomPage/CustomPageWrapper'
import { GET_SECONDARY_SCHOOL_PROGRAMME_BY_ID_QUERY } from '../queries/SecondarySchoolStudies'
import { m } from './messages/messages'
import {
  DetailContent,
  DetailSidebar,
  DetailSidebarMobile,
  Footer,
  Header,
  MobileFooter,
  ProgrammeHeader,
} from './components'
import * as styles from './SecondarySchoolStudies.css'

interface SecondarySchoolStudiesDetailsPageProps {
  programme: SecondarySchoolProgrammeByIdQuery['secondarySchoolProgrammeById']
}

const SecondarySchoolStudiesDetailsPage: Screen<
  SecondarySchoolStudiesDetailsPageProps
> = ({ programme }) => {
  const { formatMessage } = useIntl()
  const [isMounted, setIsMounted] = useState(false)
  const { width } = useWindowSize()

  const isTablet = isMounted && width <= theme.breakpoints.lg

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Box>
      <HeadWithSocialSharing
        title={programme?.title || formatMessage(m.details.unknownProgramme)}
        description={programme?.description || ''}
      />

      <Header isTablet={isTablet} />

      <GridContainer>
        <Box
          display="flex"
          flexDirection="row"
          height="full"
          paddingY={6}
          position="relative"
        >
          {/* Sidebar - Desktop only */}
          {!isTablet && (
            <Box
              printHidden
              display={['none', 'none', 'block']}
              position="sticky"
              alignSelf="flexStart"
              className={styles.sidebar}
              style={{ top: 72 }}
            >
              <DetailSidebar schools={programme.schools} />
            </Box>
          )}

          {/* Content Wrapper */}
          <Box flexGrow={1} paddingLeft={2} className={styles.contentWrapper}>
            {/* ADD mobile showing of the schools  */}
            {isTablet && <DetailSidebarMobile schools={programme.schools} />}

            <Box display="flex" flexDirection="column" rowGap={4}>
              <ProgrammeHeader
                title={programme?.title}
                ministrySerial={programme?.ministrySerial}
                studyTrackName={programme?.studyTrack?.name}
                credits={programme?.credits}
                qualificationLevel={programme?.qualification?.level?.name}
                specializationTitle={programme?.specialization?.title}
              />

              {programme?.description && (
                <Box>
                  <Text variant="default">{programme.description}</Text>
                </Box>
              )}

              <DetailContent programme={programme} />
            </Box>
          </Box>
        </Box>
      </GridContainer>
      {isTablet ? <MobileFooter /> : <Footer />}
    </Box>
  )
}

SecondarySchoolStudiesDetailsPage.getProps = async ({
  apolloClient,
  locale: _locale,
  query,
}) => {
  const programmeResult =
    await apolloClient.query<SecondarySchoolProgrammeByIdQuery>({
      query: GET_SECONDARY_SCHOOL_PROGRAMME_BY_ID_QUERY,
      variables: {
        id: query.id as string,
      },
    })

  const programme = programmeResult.data.secondarySchoolProgrammeById

  return {
    programme,
    languageToggleHrefOverride: {
      is: `/framhaldsskolanam/${programme.id}`,
      en: `/en/secondary-school-studies/${programme.id}`,
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.SecondarySchoolStudies,
    SecondarySchoolStudiesDetailsPage,
  ),
  {
    footerVersion: 'organization',
  },
)
