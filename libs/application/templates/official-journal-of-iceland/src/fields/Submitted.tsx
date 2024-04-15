import { FormGroup } from '../components/form/FormGroup'
import { OJOIFieldBaseProps } from '../lib/types'
import { Box, Button, LinkV2 } from '@island.is/island-ui/core'
import { CompleteImage } from '../assets/CompleteImage'
import { submitted } from '../lib/messages/submitted'
import { useLocale } from '@island.is/localization'
export const Submitted = (props: OJOIFieldBaseProps) => {
  const { formatMessage } = useLocale()

  const path = window.location.origin
  const isLocalhost = path.includes('localhost')
  const href = isLocalhost
    ? `http://localhost:4200/minarsidur/umsoknir#${props.application.id}`
    : `${path}/minarsidur/umsoknir#${props.application.id}`

  return (
    <FormGroup>
      <Box display="flex">
        <CompleteImage />
      </Box>
      <Box display="flex" justifyContent="flexEnd">
        <LinkV2 href={href}>
          <Button>
            {formatMessage(submitted.general.returnToServicePortal)}
          </Button>
        </LinkV2>
      </Box>
    </FormGroup>
  )
}
