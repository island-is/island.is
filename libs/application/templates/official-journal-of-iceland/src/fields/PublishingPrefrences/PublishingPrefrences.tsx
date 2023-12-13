import { FieldBaseProps } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FC } from 'react'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { useFormatMessage } from '../../hooks'
import { m } from '../../lib/messages'

export const PublishingPrefrences: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ application }) => {
  const { f } = useFormatMessage(application)

  return (
    <Box>
      <FormIntro
        title={f(m.publishingPreferencesFormTitle)}
        description={f(m.publishingPreferencesFormIntro)}
      />
    </Box>
  )
}
