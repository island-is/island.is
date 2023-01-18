import { parentalLeaveFormMessages } from '@island.is/application/templates/parental-leave'
import { Box, Icon, Table as T } from '@island.is/island-ui/core'
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
  return (
    <T.Table>
      <T.Head>
        <T.Row>
          {editable && <T.HeadData></T.HeadData>}
          <T.HeadData>Netfang</T.HeadData>
          {/* <T.HeadData>{parentalLeaveFormMessages.employer.emailHeader}</T.HeadData> */}
          <T.HeadData>Símanumer</T.HeadData>
          <T.HeadData>Hlutfall</T.HeadData>
          <T.HeadData>Samþykkt</T.HeadData>
          {/* <T.HeadData>{parentalLeaveFormMessages.employer.phoneNumber}</T.HeadData> */}
          {/* <T.HeadData>{parentalLeaveFormMessages.employer.ratio}</T.HeadData> */}
          {/* <T.HeadData>{parentalLeaveFormMessages.employer.confirmation}</T.HeadData> */}
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
            <T.Data>{e.isApproved ? 'Já' : 'Nei'}</T.Data>
            {/* <T.Data>{e.isApproved ? parentalLeaveFormMessages.shared.yesOptionLabel : parentalLeaveFormMessages.shared.noOptionLabel}</T.Data> */}
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
