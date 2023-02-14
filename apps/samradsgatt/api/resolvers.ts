export const resolvers = {
  Query: {
    cases: (_, __, { dataSources }) => dataSources.caseAPI.getAllCases(),
  },
}

export default resolvers
