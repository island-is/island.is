import { Case } from '../../types/interfaces'
import { SimpleCardSkeleton } from '../Card'
import StackedTitleAndDescription from '../StackedTitleAndDescription/StackedTitleAndDescription'
import { Box, LinkV2 } from '@island.is/island-ui/core'
import env from '../../lib/environment'

export const CaseStatusCard = ({
  summaryText,
  summaryLink,
  summaryDocumentId,
}: Case) => {
  return (
    <SimpleCardSkeleton borderColor="blue600" borderWidth="large">
      <StackedTitleAndDescription headingColor="blue400" title={'Niðurstöður'}>
        {summaryText}
      </StackedTitleAndDescription>
      {summaryLink && (
        <LinkCard link={summaryLink} text="Skjal að loknu samráði" />
      )}
      {summaryDocumentId && (
        <LinkCard
          link={`${env.backendDownloadUrl}${summaryDocumentId}`}
          text="Nánar um niðurstöður"
        />
      )}
    </SimpleCardSkeleton>
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
