import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { rejected } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { Comments } from '../fields/Comments'
import { AlertMessage, Stack, Button, Box } from '@island.is/island-ui/core'

export const RejectScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()

  const goToServicePortal = () => {
    const isLocalhost = window.location.origin.includes('localhost')

    window.open(
      isLocalhost
        ? `http://localhost:4200/minarsidur/umsoknir#${props.application.id}`
        : `${window.location.origin}/minarsidur/umsoknir#${props.application.id}`,
      '_self',
    )
  }

  return (
    <FormScreen title={f(rejected.general.title)}>
      <Stack space={4}>
        <AlertMessage
          type="info"
          title={f(rejected.general.title)}
          message={f(rejected.general.intro)}
        />
        <Comments {...props} canAddComment={false} />
        <Box display="flex" justifyContent="flexEnd">
          <Button onClick={goToServicePortal}>
            {f(rejected.general.goToServicePortal)}
          </Button>
        </Box>
      </Stack>
    </FormScreen>
  )
}
