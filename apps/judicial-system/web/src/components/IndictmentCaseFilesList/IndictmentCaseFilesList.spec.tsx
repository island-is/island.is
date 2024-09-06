import { render, screen } from '@testing-library/react'

import {
  CaseFileCategory,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockCaseFile,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import IndictmentCaseFilesList from './IndictmentCaseFilesList'

describe('IndictmentCaseFilesList', () => {
  it('should render court records if there are courtRecord case files', () => {
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <IndictmentCaseFilesList
            workingCase={{
              ...mockCase(CaseType.INDICTMENT),
              caseFiles: [mockCaseFile(CaseFileCategory.COURT_RECORD)],
            }}
          />
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

    expect(screen.queryByTestId('PDFButton')).not.toBeNull()
  })
})
