import ReactHtmlParser from 'react-html-parser'
import { useIntl } from 'react-intl'

import { Box, GridContainer, Text } from '@island.is/island-ui/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { HeadWithSocialSharing, Webreader } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  SecondarySchoolProgrammeByIdQuery,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

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
  locale: string
}

const SecondarySchoolStudiesDetailsPage: Screen<
  SecondarySchoolStudiesDetailsPageProps
> = ({ programme, locale }) => {
  const { formatMessage } = useIntl()

  return (
    <Box>
      <HeadWithSocialSharing
        title={programme?.title || formatMessage(m.details.unknownProgramme)}
        description={programme?.description || ''}
      />

      <Header />

      <GridContainer>
        <Box
          display="flex"
          flexDirection="row"
          height="full"
          paddingY={6}
          position="relative"
        >
          {/* Sidebar - Desktop only */}
          <Box
            printHidden
            display={['none', 'none', 'none', 'block']}
            position="sticky"
            alignSelf="flexStart"
            component="aside"
            className={styles.sidebar}
            style={{ top: 72 }}
          >
            <DetailSidebar schools={programme.schools} locale={locale} />
          </Box>

          {/* Content Wrapper */}
          <Box
            component="article"
            flexGrow={1}
            paddingLeft={2}
            className={styles.contentWrapper}
          >
            <Box display={['block', 'block', 'block', 'none']} marginBottom={2}>
              <Webreader marginBottom={0} marginTop={0} />
            </Box>
            <Box display={['block', 'block', 'block', 'none']}>
              <DetailSidebarMobile
                schools={programme.schools}
                locale={locale}
              />
            </Box>

            <Box display="flex" flexDirection="column" rowGap={4}>
              <Box display={['none', 'none', 'none', 'block']} margin={0}>
                <Webreader />
              </Box>
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
                  <Text>
                    {' '}
                    {ReactHtmlParser(
                      programme.description
                        .replaceAll('\n', '<br/>')
                        .replace(/<(\/?)p>/g, '<$1span>'),
                    )}
                  </Text>
                </Box>
              )}

              <DetailContent programme={programme} />
            </Box>
          </Box>
        </Box>
      </GridContainer>
      <Box display={['none', 'none', 'none', 'block']} component="footer">
        <Footer />
      </Box>
      <Box display={['block', 'block', 'block', 'none']} component="footer">
        <MobileFooter />
      </Box>
    </Box>
  )
}

SecondarySchoolStudiesDetailsPage.getProps = async ({
  apolloClient,
  locale,
  query,
}) => {
  if (isRunningOnEnvironment('production'))
    throw new CustomNextError(404, 'Feature not live')

  if (!query?.id) {
    throw new CustomNextError(404, 'Programme not found')
  }

  const programmeResult =
    await apolloClient.query<SecondarySchoolProgrammeByIdQuery>({
      query: GET_SECONDARY_SCHOOL_PROGRAMME_BY_ID_QUERY,
      variables: {
        id: query.id as string,
      },
    })

  const programme = programmeResult?.data?.secondarySchoolProgrammeById

  if (!programme) {
    throw new CustomNextError(404, 'Programme not found')
  }

  return {
    programme,
    languageToggleHrefOverride: {
      is: `/framhaldsskolanam/${programme.id}`,
      en: `/en/secondary-school-studies/${programme.id}`,
    },
    locale,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.SecondarySchoolStudies,
    SecondarySchoolStudiesDetailsPage,
  ),
  {
    footerVersion: 'organization',
    showSearchInHeader: false,
  },
)
