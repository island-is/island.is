import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Button, Icon, Text, Tooltip } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { SecondarySchoolProgrammeByIdQuery } from '@island.is/web/graphql/schema'

import { m } from '../../messages/messages'
import { getSchoolData } from '../../utils/schoolDataMap'
import * as styles from './DetailSidebar.css'

interface DetailSidebarMobileProps {
  schools?: SecondarySchoolProgrammeByIdQuery['secondarySchoolProgrammeById']['schools']
}

export const DetailSidebarMobile = ({ schools }: DetailSidebarMobileProps) => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleBackClick = () => {
    router.push('/framhaldsskolanam')
  }

  const hasMultipleSchools = schools && schools.length > 1
  const singleSchool = schools?.[0]

  const getSchoolIcon = (schoolId?: string | null) => {
    return getSchoolData(schoolId).icon
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
                <Box
                  key={school?.id}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  columnGap={2}
                >
                  <img
                    src={`/assets/framhaldsskolar/${getSchoolIcon(school?.id)}`}
                    alt={`${school?.name || 'School'} logo`}
                    className={styles.schoolIconSmall}
                  />
                  <Text variant="medium" color="purple600">
                    {school?.name || formatMessage(m.details.unknownSchool)}
                  </Text>
                  <a
                    href={getSchoolData(school?.id).website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: theme.color.purple400 }}
                  >
                    {getSchoolData(school?.id).website}
                  </a>
                </Box>
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
              src={`/assets/framhaldsskolar/${getSchoolIcon(singleSchool?.id)}`}
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
