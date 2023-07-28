import {gql} from '@apollo/client';

export const addressFragment = gql`
  fragment Address on PropertyLocation {
    locationNumber
    postNumber
    municipality
    propertyNumber
    display
    displayShort
  }
`;

export const appraisalFragment = gql`
  fragment Appraisal on Appraisal {
    activeAppraisal
    plannedAppraisal
    activeStructureAppraisal
    plannedStructureAppraisal
    activePlotAssessment
    plannedPlotAssessment
    activeYear
    plannedYear
  }
`;

export const unitsOfUseFragment = gql`
  fragment unitsOfUse on UnitOfUse {
    propertyNumber
    unitOfUseNumber
    marking
    usageDisplay
    displaySize
    buildYearDisplay
    fireAssessment
    explanation
    appraisal {
      ...Appraisal
    }
    address {
      ...Address
    }
  }
  ${addressFragment}
  ${appraisalFragment}
`;

export const pagingFragment = gql`
  fragment Paging on PagingData {
    page
    pageSize
    totalPages
    offset
    total
    hasPreviousPage
    hasNextPage
  }
`;
