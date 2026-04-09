import { Box, Divider, Stack } from '@island.is/island-ui/core'
import { UserInfoLine } from '@island.is/portals/my-pages/core'

interface ApplicantOverviewItem {
  label: string
  value: string
}

interface ApplicantOverviewProps {
  items: ApplicantOverviewItem[]
}

// TODO: Replace with real data from applicant endpoint when available
export const ApplicantOverview = ({ items }: ApplicantOverviewProps) => {
  return (
    <Box paddingTop={4}>
      <Stack space={0}>
        {items.map((item, index) => (
          <Box key={index}>
            <UserInfoLine label={item.label} content={item.value} />
            <Divider />
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
