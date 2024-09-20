const { startWithBff } = require('@island.is/services/bff')

startWithBff('admin-portal', ['nx', 'run', 'portals-admin:serve'])
