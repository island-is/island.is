import { parentalLeaveFormMessages } from '../../../lib/messages'
import { Box, Icon, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { EmployerRow } from '../../../types'

interface EmployerTableProps {
  employers: EmployerRow[] | undefined
  editable?: boolean
  onDeleteEmployer?: (nationalId: string) => void
}

export const EmployersTable = ({
  employers,
  editable = false,
  onDeleteEmployer = () => undefined,
}: EmployerTableProps) => {
  const { formatMessage } = useLocale()
  return (
    <T.Table>
      <T.Head>
        <T.Row>
          {editable && <T.HeadData></T.HeadData>}
          <T.HeadData>
            {formatMessage(parentalLeaveFormMessages.employer.emailHeader)}
          </T.HeadData>
          <T.HeadData>
            {formatMessage(
              parentalLeaveFormMessages.employer.phoneNumberHeader,
            )}
          </T.HeadData>
          <T.HeadData>
            {formatMessage(parentalLeaveFormMessages.employer.ratioHeader)}
          </T.HeadData>
          <T.HeadData>
            {formatMessage(parentalLeaveFormMessages.employer.approvedHeader)}
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {employers?.map((e, i) => (
          <T.Row key={`${e.email}${i}`}>
            {editable && (
              <T.Data>
                <Box onClick={() => onDeleteEmployer(e.email)}>
                  <Icon
                    color="dark200"
                    icon="removeCircle"
                    size="medium"
                    type="outline"
                  />
                </Box>
              </T.Data>
            )}
            <T.Data>{e.email}</T.Data>
            <T.Data>{e.phoneNumber}</T.Data>
            <T.Data>{e.ratio}%</T.Data>
            <T.Data>
              {e.isApproved
                ? formatMessage(parentalLeaveFormMessages.shared.yesOptionLabel)
                : formatMessage(parentalLeaveFormMessages.shared.noOptionLabel)}
            </T.Data>
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
