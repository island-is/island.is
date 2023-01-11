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
          <T.HeadData>Kennitala</T.HeadData>
          <T.HeadData>Nafn</T.HeadData>
          <T.HeadData>Netfang</T.HeadData>
          <T.HeadData>Símanúmer</T.HeadData>
          <T.HeadData>Hlutfall</T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {employers?.map((e) => (
          <T.Row key={`${e.email}${e.name.nationalId}`}>
            {editable && (
              <T.Data>
                <Box onClick={() => onDeleteEmployer(e.name.nationalId)}>
                  <Icon
                    color="dark200"
                    icon="removeCircle"
                    size="medium"
                    type="outline"
                  />
                </Box>
              </T.Data>
            )}
            <T.Data>{e.name?.nationalId}</T.Data>
            <T.Data>{e.name?.label}</T.Data>
            <T.Data>{e.email}</T.Data>
            <T.Data>{e.phoneNumber}</T.Data>
            <T.Data>{e.ratio}%</T.Data>
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
