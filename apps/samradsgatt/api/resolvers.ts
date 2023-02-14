export const resolvers = {
    Query: {
        launches: (_, __, { dataSources }) =>
          dataSources.launchAPI.getAllLaunches(),
        launch: (_, { id }, { dataSources }) =>
          dataSources.launchAPI.getLaunchById({ launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
      },
}

export default resolvers