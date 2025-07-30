import { Box, Icon, Inline, Text } from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { useLocale } from '@island.is/localization'
import { FormSystemApplication } from '@island.is/api/schema'
import { dateFormat } from '@island.is/shared/constants'
import { ApplicationCardTag } from './components/ApplicationCardTag'
import * as styles from './ApplicationCard.css'
import { ApplicationCardProgress } from './components/ApplicationCardProgress'
import { useNavigate, useParams } from 'react-router-dom'
import { ApplicationCardDelete } from './components/ApplicationCardDelete'

interface Props {
  application: FormSystemApplication
  onDelete: () => void
  focused?: boolean
}

export const ApplicationCard = ({ application, focused = false }: Props) => {
  const { status } = application
  const { slug } = useParams()
  const navigate = useNavigate()
  const { lang: locale } = useLocale()
  const formattedDate = locale === 'is' ? dateFormat.is : dateFormat.en
  const heading = application?.formName?.[locale]
  const logo = false // Do we implement logos?
  const description = 'Description' // Do we implement descriptions?

  const openApplication = () => {
    navigate(`../${slug}/${application.id}`)
  }

  const shouldRenderProgress = status === 'IN_PROGRESS'
  return (
    <Box
      display="flex"
      flexDirection="column"
      borderColor={focused ? 'mint400' : 'blue200'}
      borderRadius="large"
      borderWidth="standard"
      paddingX={[3, 3, 4]}
      paddingY={3}
      background="white"
    >
      <Box
        alignItems={['flexStart', 'center']}
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        marginBottom={2}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box display="flex" marginRight={1} justifyContent="center">
            <Icon icon="time" size="medium" type="outline" color="blue400" />
          </Box>
          <Box display="flex" justifyContent="center">
            <Text variant="small">
              {format(new Date(application.modified), formattedDate)}
            </Text>
          </Box>
        </Box>
        <Inline alignY="center" justifyContent="flexEnd" space={1}>
          <ApplicationCardTag />
          <ApplicationCardDelete
          // application={application}
          />
        </Inline>
      </Box>

      <Box flexDirection="row" width="full">
        {heading && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            alignItems={['flexStart', 'flexStart', 'flexEnd']}
          >
            <Box display="flex" flexDirection="row" alignItems="center">
              {logo && (
                <Box
                  padding={2}
                  marginRight={2}
                  className={styles.logo}
                  style={{ backgroundImage: `url(${logo})` }}
                ></Box>
              )}
              <Text variant="h3" color="currentColor">
                {heading}
              </Text>
            </Box>
          </Box>
        )}

        {description && <Text paddingTop={heading ? 1 : 0}>{description}</Text>}
      </Box>
      {shouldRenderProgress && (
        <ApplicationCardProgress
          application={application}
          onOpenApplication={openApplication}
          shouldShowCardButtons={true}
        />
      )}
    </Box>
  )
}
