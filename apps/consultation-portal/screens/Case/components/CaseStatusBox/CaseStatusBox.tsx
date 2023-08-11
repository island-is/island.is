import { CardSkeleton } from '../../../../components'
import StackedTitleAndDescription from '../Stacked/Stacked'
import { Box, Button, Text } from '@island.is/island-ui/core'
import Link from 'next/link'
import localization from '../../Case.json'

interface Props {
  status: string
}
export const CaseStatusBox = ({ status }: Props) => {
  const loc = localization['caseStatusBox']

  return (
    <CardSkeleton>
      <StackedTitleAndDescription
        headingColor="blue400"
        title={loc[status].title}
      >
        <Text>{`${loc[status].text} ${loc[status].textCont}`}</Text>
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
