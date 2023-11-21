import Link from 'next/link'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { CardSkeleton } from '../../../../components'
import StackedTitleAndDescription from '../Stacked/Stacked'
import localization from '../../Case.json'
import sharedLocalization from '../../../../lib/shared.json'
import { CaseStatusText } from '../../components'

interface Props {
  status: string
  advicePublishTypeId: number
  shouldDisplayHidden?: boolean
}

export const CaseStatusBox = ({
  status,
  advicePublishTypeId,
  shouldDisplayHidden = false,
}: Props) => {
  const loc = localization['caseStatusBox']
  const sloc = sharedLocalization['publishingRules']

  return (
    <CardSkeleton>
      <StackedTitleAndDescription
        headingColor="blue400"
        title={loc[status].title}
      >
        <Text>
          <CaseStatusText
            sloc={sloc}
            status={status}
            advicePublishTypeId={advicePublishTypeId}
            shouldDisplayHidden={shouldDisplayHidden}
            linkProps={{ href: '#view-advices', label: sloc.viewAdvices.text }}
          />
        </Text>
      </StackedTitleAndDescription>
      {status === 'Til umsagnar' && (
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
