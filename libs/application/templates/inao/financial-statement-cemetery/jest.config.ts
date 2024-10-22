/* eslint-disable */
export default {
<<<<<<<< HEAD:libs/portals/form-system/ui-components/jest.config.ts
  displayName: 'portals-form-system-ui-components',
  preset: '../../../../jest.preset.js',
========
  displayName: 'financial-statement-cemetery',
  preset: '../../../../../jest.preset.js',
>>>>>>>> dd03c10c0a65f67627212406bfd78261dec7d631:libs/application/templates/inao/financial-statement-cemetery/jest.config.ts
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
<<<<<<<< HEAD:libs/portals/form-system/ui-components/jest.config.ts
    '../../../../coverage/libs/portals/form-system/ui-components',
========
    '../../../../../coverage/libs/application/templates/inao/financial-statement-cemetery',
>>>>>>>> dd03c10c0a65f67627212406bfd78261dec7d631:libs/application/templates/inao/financial-statement-cemetery/jest.config.ts
}
