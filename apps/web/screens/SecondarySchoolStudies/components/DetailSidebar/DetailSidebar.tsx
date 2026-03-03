import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Button, Text, Tooltip } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { SecondarySchoolProgrammeByIdQuery } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'

import { m } from '../../messages/messages'
import { getSchoolData } from '../../utils/schoolDataMap'
import * as styles from './DetailSidebar.css'

interface DetailSidebarProps {
  schools?: SecondarySchoolProgrammeByIdQuery['secondarySchoolProgrammeById']['schools']
  locale: string
}

export const DetailSidebar = ({ schools, locale }: DetailSidebarProps) => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()
  const handleBackClick = () => {
    router.push(
      linkResolver(
        'secondaryschoolstudieslandingpage',
        [],
        locale === 'en' ? 'en' : 'is',
      ).href,
    )
  }

  const hasMultipleSchools = schools && schools.length > 1
  const singleSchool = schools?.[0]

  const getSchoolIcon = (schoolAbbrv?: string | null) => {
    return getSchoolData(schoolAbbrv).icon
  }

  return (
    <Box
      className={styles.sidebar}
      display="flex"
      flexDirection="column"
      rowGap={3}
    >
      <Box display="inlineFlex">
        <Button
          variant="text"
          preTextIcon="arrowBack"
          preTextIconType="outline"
          size="small"
          onClick={handleBackClick}
        >
          {formatMessage(m.details.backToSearch)}
        </Button>
      </Box>

      {hasMultipleSchools ? (
        <Box className={styles.multipleSchoolsContainer}>
          <Box display={'flex'} columnGap={1}>
            <Text variant="eyebrow" marginBottom={2} color="purple400">
              {formatMessage(m.details.programmeOfferedAt)}
            </Text>
            <Tooltip text={formatMessage(m.details.tooltip)} />
          </Box>
          <Box display="flex" flexDirection="column" rowGap={2}>
            {schools?.map((school) => (
              <a
                key={school?.id}
                href={getSchoolData(school?.abbreviation).website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: theme.color.purple400 }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  columnGap={2}
                  cursor="pointer"
                >
                  <img
                    src={`/assets/framhaldsskolar/${getSchoolIcon(
                      school?.abbreviation,
                    )}`}
                    alt={`${school?.name || 'School'} logo`}
                    className={styles.schoolIconSmall}
                  />
                  <Text variant="medium" color="purple600">
                    {school?.name || formatMessage(m.details.unknownSchool)}
                  </Text>
                </Box>
              </a>
            ))}
          </Box>
        </Box>
      ) : (
        <a
          href={getSchoolData(singleSchool?.abbreviation).website}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme.color.purple400 }}
        >
          <Box
            display="flex"
            flexDirection="row"
            columnGap={2}
            alignItems={'center'}
            padding={3} // Double check if its 24px
            style={{ backgroundColor: theme.color.purple100 }}
          >
            <Box display="flex" justifyContent="center" alignSelf="center">
              <img
                src={`/assets/framhaldsskolar/${getSchoolIcon(
                  singleSchool?.abbreviation,
                )}`}
                alt={`${singleSchool?.name || 'School'} logo`}
                className={styles.schoolIcon}
              />
            </Box>
            <Text variant="h4" as="h3" textAlign="center" color="purple400">
              {singleSchool?.name || formatMessage(m.details.unknownSchool)}
            </Text>
          </Box>
        </a>
      )}
    </Box>
  )
}
