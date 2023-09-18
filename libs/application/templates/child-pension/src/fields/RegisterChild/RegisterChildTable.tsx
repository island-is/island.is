import { Box, Icon, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ChildPensionRow } from '../../types'
import { childPensionFormMessage } from '../../lib/messages'
import format from 'date-fns/format'
import { formatText } from '@island.is/application/core'
import { getChildPensionReasonOptions } from '../../lib/childPensionUtils'
import { Application } from '@island.is/application/types'

interface RegisterChildTableProps {
  children: ChildPensionRow[] | undefined
  onDeleteChild?: (nationalId: string, name: string) => void
  application: Application
}

export const RegisterChildTable = ({
  children,
  onDeleteChild = () => undefined,
  application,
}: RegisterChildTableProps) => {
  const { formatMessage } = useLocale()
  const childPensionReasonOptions = getChildPensionReasonOptions()

  return (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData></T.HeadData>
          <T.HeadData>
            {formatMessage(
              childPensionFormMessage.info.registerChildRepeaterTableHeaderName,
            )}
          </T.HeadData>
          <T.HeadData>
            {formatMessage(
              childPensionFormMessage.info.registerChildRepeaterTableHeaderId,
            )}
          </T.HeadData>
          <T.HeadData>
            {formatMessage(
              childPensionFormMessage.info
                .registerChildRepeaterTableHeaderReasonOne,
            )}
          </T.HeadData>
          <T.HeadData>
            {formatMessage(
              childPensionFormMessage.info
                .registerChildRepeaterTableHeaderReasonTwo,
            )}
          </T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {children?.map((child, index) => {
          const reasons = child.reason.map(
            (reason) =>
              childPensionReasonOptions.find(
                (option) => option.value === reason,
              )?.label,
          )
          return (
            <T.Row
              key={`${child.name}-${child.nationalIdOrBirthDate}-${index}`}
            >
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
              <T.Data>
                {reasons[0] &&
                  formatText(reasons[0], application, formatMessage)}
              </T.Data>
              <T.Data>
                {reasons[1] &&
                  formatText(reasons[1], application, formatMessage)}
              </T.Data>
            </T.Row>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
