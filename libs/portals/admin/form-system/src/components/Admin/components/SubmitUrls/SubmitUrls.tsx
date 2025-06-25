import { Box, Button, ToggleSwitchButton } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import * as styles from '../../../tableHeader.css'
import { TableHeader } from './TableHeader'
import { FormSystemOrganizationUrl } from '@island.is/api/schema'
import { TableRow } from './TableRow'

interface SubmitUrlsProps {
  submitUrls: FormSystemOrganizationUrl[]
}

export const SubmitUrls = ({ submitUrls }: SubmitUrlsProps) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        marginBottom={2}
        marginTop={6}
        columnGap={6}
      >
        <Button size="small" variant="utility">
          Nýtt
        </Button>
        <Box marginTop={2}>
          <ToggleSwitchButton
            label={'Zendesk'}
            checked={false}
            onChange={function (newChecked: boolean): void {
              throw new Error('Function not implemented.')
            }}
          />
        </Box>
      </Box>
      <TableHeader type="Raunslóð" />
      <Box marginTop={2}>
        {submitUrls
          .filter((url) => !url.isTest)
          .map((url) => (
            <TableRow key={url.id} url={url} />
          ))}
      </Box>

      <Box
        display="flex"
        alignItems="center"
        marginBottom={2}
        marginTop={20}
        columnGap={6}
      >
        <Button size="small" variant="utility">
          Nýtt
        </Button>
        <Box marginTop={2}>
          <ToggleSwitchButton
            label={'Zendesk'}
            checked={false}
            onChange={function (newChecked: boolean): void {
              throw new Error('Function not implemented.')
            }}
          />
        </Box>
      </Box>
      <TableHeader type="Prófunarslóð" />
      <Box marginTop={2}>
        {submitUrls
          .filter((url) => url.isTest)
          .map((url) => (
            <TableRow key={url.id} url={url} />
          ))}
      </Box>
    </>
  )
}
