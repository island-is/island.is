import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ApplicationConfigurations,
  FieldBaseProps,
} from '@island.is/application/types'
import {
  Box,
  Bullet,
  BulletList,
  Button,
  AlertMessage,
  AccordionCard,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { childPensionFormMessage } from '../../lib/messages'
import BabyIllustration from '../../assets/Images/Baby'
import * as styles from './Conclusion.css'
import Markdown from 'markdown-to-jsx'

const Conclusion: FC<FieldBaseProps> = ({ application, field }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const handleRefresh = () => {
    navigate(`/${ApplicationConfigurations.childPension.slug}`)
    navigate(
      `/${ApplicationConfigurations.childPension.slug}/${application.id}`,
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
          type="success"
          title={formatMessage(
            childPensionFormMessage.conclusionScreen.alertTitle,
          )}
        />
        <AccordionCard
          startExpanded={true}
          id={`conclusion-card-${field.id}`}
          label={formatMessage(
            childPensionFormMessage.conclusionScreen.nextStepsLabel,
          )}
        >
          <Text marginBottom={4}>
            {formatMessage(
              childPensionFormMessage.conclusionScreen.nextStepsText,
            )}
          </Text>
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
              {formatMessage(
                childPensionFormMessage.conclusionScreen.bulletList,
              )}
            </Markdown>
          </BulletList>
        </AccordionCard>
        <BabyIllustration />
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
                childPensionFormMessage.conclusionScreen.buttonsViewApplication,
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Conclusion
