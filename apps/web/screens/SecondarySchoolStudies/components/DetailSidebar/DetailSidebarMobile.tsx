import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Button, Icon, Text, Tooltip } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { SecondarySchoolProgrammeByIdQuery } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'

import { m } from '../../messages/messages'
import { getSchoolData } from '../../utils/schoolDataMap'
import * as styles from './DetailSidebar.css'

interface DetailSidebarMobileProps {
  schools?: SecondarySchoolProgrammeByIdQuery['secondarySchoolProgrammeById']['schools']
  locale: string
}

export const DetailSidebarMobile = ({
  schools,
  locale,
}: DetailSidebarMobileProps) => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const [isExpanded, setIsExpanded] = useState(false)
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
    <Box display="flex" flexDirection="column" rowGap={3}>
      <Box
        display="flex"
        alignItems="center"
        className={styles.mobileSidebarFilterButton}
      >
        <Button
          variant="text"
          preTextIcon="arrowBack"
          preTextIconType="outline"
          size="default"
          onClick={handleBackClick}
        >
          {formatMessage(m.details.backToSearch)}
        </Button>
      </Box>

      {hasMultipleSchools ? (
        <Box
          padding={3}
          marginBottom={2}
          style={{
            backgroundColor: theme.color.purple100,
            borderRadius: '8px',
          }}
        >
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            style={{ cursor: 'pointer' }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Box display="flex" columnGap={1} alignItems="center">
              <Text variant="eyebrow" color="purple400">
                {formatMessage(m.details.programmeOfferedAt)}
              </Text>
              <Tooltip text={formatMessage(m.details.tooltip)} />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              style={{
                transition: 'transform 0.2s',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <Icon icon={'chevronUp'} size="medium" color={'purple400'} />
            </Box>
          </Box>

          {isExpanded && (
            <Box display="flex" flexDirection="column" rowGap={2} marginTop={3}>
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
          )}
        </Box>
      ) : (
        <Box
          display="flex"
          flexDirection="row"
          columnGap={2}
          alignItems="center"
          padding={3}
          style={{
            backgroundColor: theme.color.purple100,
            borderRadius: '8px',
          }}
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
          <Text variant="h4" as="h3" color="purple400">
            {singleSchool?.name || formatMessage(m.details.unknownSchool)}
          </Text>
        </Box>
      )}
    </Box>
  )
}
