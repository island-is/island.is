import { CardSkeleton } from '../../../../components'
import StackedTitleAndDescription from '../Stacked/Stacked'
import { Box, Button, Text } from '@island.is/island-ui/core'
import Link from 'next/link'
import localization from '../../Case.json'
import sharedLocalization from '../../../../lib/shared.json'
import { advicePublishTypeKeyHelper } from '../../../../types/enums'

interface Props {
  status: string
  advicePublishTypeId: number
}
export const CaseStatusBox = ({ status, advicePublishTypeId }: Props) => {
  const loc = localization['caseStatusBox']
  const sloc = sharedLocalization['publishingRules']
  const publishRuleText =
    status == 'Til umsagnar'
      ? sloc[advicePublishTypeKeyHelper[advicePublishTypeId]].present
      : sloc[advicePublishTypeKeyHelper[advicePublishTypeId]].past
  return (
    <CardSkeleton>
      <StackedTitleAndDescription
        headingColor="blue400"
        title={loc[status].title}
      >
        <Text>{`${loc[status].text} ${publishRuleText} ${loc[status].textCont}`}</Text>
      </StackedTitleAndDescription>
      {status == 'Til umsagnar' && (
        <Box paddingTop={2}>
          <Link href="#write-review" shallow legacyBehavior>
            <Button fluid iconType="outline" nowrap as="a">
              {loc[status].buttons.sendAdvice}
            </Button>
          </Link>
        </Box>
      )}
    </CardSkeleton>
  )
}
export default CaseStatusBox
