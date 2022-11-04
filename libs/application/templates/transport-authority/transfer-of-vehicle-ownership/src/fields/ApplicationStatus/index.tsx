import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, Text, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { ReviewScreenProps } from '../../types'
import { StatusStep } from './StatusStep'
import { Steps } from './StatusStep/types'

export const ApplicationStatus: FC<FieldBaseProps & ReviewScreenProps> = ({
  goToScreen,
  application,
  field,
  setStep,
}) => {
  const { formatMessage } = useLocale()

  const changeScreens = (screen: string) => {
    if (goToScreen) goToScreen(screen)
  }

  const steps = [
    {
      tagText: 'Móttekin',
      tagVariant: 'mint',
      title: 'Skráning eigendaskipta á ökutæki OL712',
      description: 'Tilkynning um eigendaskiptu hefur borist til Samgöngustofu',
      hasActionMessage: false,
    },
    {
      tagText: 'Móttekin',
      tagVariant: 'mint',
      title: 'Greiðsla móttekin',
      description: 'Greitt hefur verið fyrir eigendaskiptin af seljanda',
      hasActionMessage: false,
    },
    {
      tagText: 'Samþykki í bið',
      tagVariant: 'purple',
      title: 'Samþykki kaupanda',
      description: 'Beðið er eftir að nýr eigandi staðfesti eigendaskiptin.',
      hasActionMessage: false,
    },
    {
      tagText: 'Samþykki í bið',
      tagVariant: 'purple',
      title: 'Samþykki meðeiganda',
      description:
        'Beðið er eftir að meðeigandi kaupanda staðfesti eigendaskiptin.',
      hasActionMessage: false,
    },
  ] as Steps[]

  return (
    <Box marginBottom={10}>
      <Text variant="h1" marginBottom={2}>
        Staða tilkynningar
      </Text>
      <Box marginTop={4} display="flex" justifyContent="flexEnd">
        <Button
          colorScheme="default"
          iconType="filled"
          size="small"
          type="button"
          variant="text"
          onClick={() => changeScreens('inReviewOverviewScreen')}
        >
          Yfirlit
        </Button>
      </Box>
      <Box marginTop={4} marginBottom={8}>
        {steps.map((step, index) => (
          <StatusStep
            key={index}
            title={step.title}
            description={step.description}
            hasActionMessage={step.hasActionMessage}
            action={step.action}
            tagText={step.tagText}
            tagVariant={step.tagVariant}
            visible={step.visible}
          />
        ))}
      </Box>
      <Divider />
      <Box display="flex" justifyContent="flexEnd" paddingY={5}>
        <Button onClick={() => setStep('overview')}>Opna yfirlit</Button>
      </Box>
    </Box>
  )
}
