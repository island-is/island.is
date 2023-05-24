import { SimpleCardSkeleton } from '../../../../components/Card'
import StackedTitleAndDescription from '../../../../components/StackedTitleAndDescription/StackedTitleAndDescription'
import { Box, Button, Text } from '@island.is/island-ui/core'
import Link from 'next/link'
import localization from '../../Case.json'

interface Props {
  status: string
}
export const CaseStatusBox = ({ status }: Props) => {
  const loc = localization['caseStatusBox']

  return (
    <SimpleCardSkeleton>
      <StackedTitleAndDescription
        headingColor="blue400"
        title={loc[status].title}
      >
        <Text>{`${loc[status].text} ${loc[status].textCont}`}</Text>
      </StackedTitleAndDescription>
      {status == 'Til umsagnar' && (
        <Box paddingTop={2}>
          <Link href="#write-review" shallow>
            <Button fluid iconType="outline" nowrap as="a">
              {loc[status].buttons.sendAdvice}
            </Button>
          </Link>
        </Box>
      )}
    </SimpleCardSkeleton>
  )
}
export default CaseStatusBox
