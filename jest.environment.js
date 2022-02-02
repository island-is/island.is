if (process.env.DD_ENV === 'ci') {
  require('dd-trace/ci/jest/env')
}

module.exports = require('jest-environment-node')
