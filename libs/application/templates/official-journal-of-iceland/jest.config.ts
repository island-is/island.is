// Run ahead of UTC. Iceland is UTC+0 all year, which hides dates shifting by
// a day between local and UTC midnight. Set here, before the workers start:
// a test's process.env is a copy, so setting TZ in a spec has no effect.
process.env.TZ = 'Europe/Berlin'

module.exports = {
  displayName: 'application-templates-official-journal-of-iceland',
  preset: '../../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/libs/application/templates/official-journal-of-iceland',
}
