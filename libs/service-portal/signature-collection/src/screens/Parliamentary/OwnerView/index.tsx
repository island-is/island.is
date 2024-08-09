import { ActionCard, Stack } from '@island.is/island-ui/core'
import { constituencies } from '../../../lib/constants'

const OwnerView = () => {
  return (
    <Stack space={3}>
      {constituencies.map((c: string, index: number) => (
        <ActionCard
          key={index}
          backgroundColor="white"
          heading={'Flokkur 1 - ' + c}
          progressMeter={{
            currentProgress: 10,
            maxProgress: 350,
            withLabel: true,
          }}
        />
      ))}
    </Stack>
  )
}

export default OwnerView
