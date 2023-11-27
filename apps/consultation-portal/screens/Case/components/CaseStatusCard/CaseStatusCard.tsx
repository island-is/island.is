import { Case } from '../../../../types/interfaces'
import { CardSkeleton } from '../../../../components'
import StackedTitleAndDescription from '../Stacked/Stacked'
import { Box, LinkV2, Text } from '@island.is/island-ui/core'
import env from '../../../../lib/environment'
import localization from '../../Case.json'

export const CaseStatusCard = ({
  summaryText,
  summaryLink,
  summaryDocumentId,
}: Case) => {
  const loc = localization['caseStatusCard']

  return (
    <CardSkeleton borderColor="blue600" borderWidth="large">
      <StackedTitleAndDescription headingColor="blue400" title={loc.title}>
        <Text>{summaryText}</Text>
      </StackedTitleAndDescription>
      {summaryDocumentId && (
        <LinkCard
          link={`${env.backendDownloadUrl}${summaryDocumentId}`}
          text={loc.summaryDocumentIdText}
        />
      )}
      {summaryLink && (
        <LinkCard link={summaryLink} text={loc.summaryLinkText} />
      )}
    </CardSkeleton>
  )
}
interface LinkProps {
  link: string
  text: string
}
const LinkCard = ({ link, text }: LinkProps) => {
  return (
    <Box paddingTop={1}>
      <LinkV2
        color="blue400"
        underline="normal"
        underlineVisibility="always"
        href={link}
      >
        {text}
      </LinkV2>
    </Box>
  )
}
export default CaseStatusCard
