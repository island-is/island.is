import { Box, Icon, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ChildPensionRow } from '../../types'
import { oldAgePensionFormMessage } from '../../lib/messages'

interface ChildPensionTableProps {
  children: ChildPensionRow[] | undefined
  editable?: boolean
  onDeleteChild?: (nationalId: string) => void
}

export const ChildPensionTable = ({
  children,
  editable = false,
  onDeleteChild = () => undefined,
}: ChildPensionTableProps) => {
  const { formatMessage } = useLocale()
  return (
    <T.Table>
      <T.Head>
        <T.Row>
          {editable && <T.HeadData></T.HeadData>}
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
        {children?.map((child) => (
          <T.Row key={`${child.nationalIdOrBirthDate}`}>
            {child.editable ? (
              <T.Data>
                <Box onClick={() => onDeleteChild(child.nationalIdOrBirthDate)}>
                  <Icon
                    color="dark200"
                    icon="removeCircle"
                    size="medium"
                    type="outline"
                  />
                </Box>
              </T.Data>
            ) : (
              editable && <T.Data></T.Data>
            )}
            <T.Data>{child.name}</T.Data>
            <T.Data>{child.nationalIdOrBirthDate}</T.Data>
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
