import { oldAgePensionFormMessage } from '../../../lib/messages'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { Employer } from '../../../utils/types'
import { RatioType } from '../../../utils/constants'
import { formatPhoneNumber } from '@island.is/application/ui-components'

interface EmployerTableProps {
  employers: Employer[] | undefined
  editable?: boolean
  onDeleteEmployer?: (nationalId: string) => void
}

export const EmployersTable = ({
  employers,
  editable = false,
  onDeleteEmployer = () => undefined,
}: EmployerTableProps) => {
  const { formatMessage } = useLocale()
  const newEmployers = employers?.filter(
    (e, index) =>
      employers.findIndex((item) => item.email === e.email) === index,
  )

  return (
    <Box display="flex" flexDirection="column" rowGap={2}>
      {newEmployers?.map((e, i) => {
        const ratioYearly =
          e.ratioType === RatioType.YEARLY
            ? e.ratioYearly ?? 0
            : e.ratioMonthlyAvg ?? 0

        return (
          <Box
            key={`${e.email}${i}`}
            border="standard"
            borderColor="blue200"
            borderRadius="large"
            padding={3}
            background="blue100"
          >
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="flexStart"
              columnGap={2}
            >
              <Box flexGrow={1}>
                <Box
                  display="flex"
                  flexDirection={['column', 'row']}
                  columnGap={6}
                  rowGap={3}
                >
                  <Box>
                    <Text variant="eyebrow" color="blue400">
                      {formatMessage(oldAgePensionFormMessage.employer.emailHeader)}
                    </Text>
                    <Text variant="small">{e.email}</Text>
                  </Box>
                  <Box>
                    <Text variant="eyebrow" color="blue400">
                      {formatMessage(
                        oldAgePensionFormMessage.employer.phoneNumberHeader,
                      )}
                    </Text>
                    <Text variant="small">
                      {e.phoneNumber ? formatPhoneNumber(e.phoneNumber) : '-'}
                    </Text>
                  </Box>
                  <Box>
                    <Text variant="eyebrow" color="blue400">
                      {formatMessage(oldAgePensionFormMessage.employer.ratioHeader)}
                    </Text>
                    <Text variant="small">{ratioYearly}%</Text>
                  </Box>
                </Box>
              </Box>
              {editable && (
                <Button
                  type="button"
                  variant="utility"
                  icon="removeCircle"
                  onClick={() => onDeleteEmployer(e.email)}
                  title={formatMessage(
                    oldAgePensionFormMessage.employer.removeEmployer,
                  )}
                />
              )}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
