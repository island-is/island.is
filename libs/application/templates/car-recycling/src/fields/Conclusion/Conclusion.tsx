import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import {
  AccordionCard,
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { carRecyclingMessages } from '../../lib/messages'

import Markdown from 'markdown-to-jsx'
import PeopleWalkingNWateringPlantIllustration from '../../assets/Images/PeopleWalkingNWateringPlantIllustration'
import * as styles from './Conclusion.css'

const Conclusion: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const handleRefresh = () => {
    navigate(`/${ApplicationConfigurations.CarRecycling.slug}`)
    navigate(
      `/${ApplicationConfigurations.CarRecycling.slug}/${application.id}`,
    )
    navigate(0)
  }

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        rowGap={[4, 4, 5]}
        marginTop={[4, 4, 5]}
      >
        <AlertMessage
          type="warning"
          title={formatMessage(
            carRecyclingMessages.conclusionScreen.alertTitle,
          )}
        />
        <AccordionCard
          startExpanded={true}
          id={`conclusion-card-${field.id}`}
          label={formatMessage(
            carRecyclingMessages.conclusionScreen.nextStepsLabel,
          )}
        >
          <BulletList space="gutter" type="ul">
            <Markdown
              options={{
                overrides: {
                  li: {
                    component: Bullet,
                  },
                },
              }}
            >
              {formatMessage(carRecyclingMessages.conclusionScreen.bulletList)}
            </Markdown>
          </BulletList>
        </AccordionCard>
        <PeopleWalkingNWateringPlantIllustration />
      </Box>
      <Box marginTop={7} className={styles.buttonContainer}>
        <Box
          display="flex"
          flexDirection="rowReverse"
          alignItems="center"
          justifyContent="spaceBetween"
          paddingTop={[1, 4]}
        >
          <Box display="inlineFlex" padding={2} paddingRight="none">
            <Button icon="arrowForward" onClick={handleRefresh} type="submit">
              {formatMessage(
                carRecyclingMessages.conclusionScreen.buttonsViewApplication,
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Conclusion
