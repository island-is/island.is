import { Box, Icon, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ChildPensionRow } from '../../types'
import { oldAgePensionFormMessage } from '../../lib/messages'
import format from 'date-fns/format'

interface ChildPensionTableProps {
  children: ChildPensionRow[] | undefined
  onDeleteChild?: (nationalId: string, name: string) => void
}

export const ChildPensionTable = ({
  children,
  onDeleteChild = () => undefined,
}: ChildPensionTableProps) => {
  const { formatMessage } = useLocale()
  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData></T.HeadData>
          <T.HeadData>
            {formatMessage(
              oldAgePensionFormMessage.connectedApplications
                .childPensionTableHeaderName,
            )}
          </T.HeadData>
          <T.HeadData>
            {formatMessage(
              oldAgePensionFormMessage.connectedApplications
                .childPensionTableHeaderId,
            )}
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {children?.map((child, index) => (
          <T.Row key={`${child.name}-${child.nationalIdOrBirthDate}-${index}`}>
            <T.Data>
              <Box
                onClick={() =>
                  onDeleteChild(child.nationalIdOrBirthDate, child.name)
                }
              >
                <Icon
                  color="dark200"
                  icon="removeCircle"
                  size="medium"
                  type="outline"
                />
              </Box>
            </T.Data>
            <T.Data>{child.name}</T.Data>
            {child.childDoesNotHaveNationalId ? (
              <T.Data>
                {format(new Date(child.nationalIdOrBirthDate), 'dd.MM.yyyy')}
              </T.Data>
            ) : (
              <T.Data>{child.nationalIdOrBirthDate}</T.Data>
            )}
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
