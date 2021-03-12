const typescript = require('@rollup/plugin-typescript')
// const { rollupPluginTreat } = require('rollup-plugin-treat')

function getRollupOptions(options) {
  console.log('-getRollupOptions', options)

  const extraGlobals = {
    react: 'React',
    cn: 'classnames',
    classnames: 'classnames',
    'react-dom': 'ReactDOM',
    'styled-components': 'styled',
    '@emotion/react': 'emotionReact',
    '@emotion/styled': 'emotionStyled',
    treat: 'treat',
    'react-keyed-flatten-children': 'flattenChildren',
    'react-toastify': 'reactToastify',
    downshift: 'Downshift',
    animejs: 'anime',
    reakit: 'reakit',
    'react-animate-height': 'AnimateHeight',
    hypher: 'Hypher',
    'react-use': 'reactUse',
    'react-datepicker': 'ReactDatePicker',
    'date-fns': 'dateFns',
    'react-select': 'ReactSelect',
    'react-dropzone': 'reactDropzone',
    '@rehooks/component-size': 'useComponentSize',
  }

  if (Array.isArray(options.output)) {
    options.output.forEach((o) => {
      o.globals = { ...o.globals, ...extraGlobals }
    })
  } else {
    options.output = {
      ...options.output,
      globals: {
        ...options.output.globals,
        ...extraGlobals,
      },
    }
  }

  options.plugins = [
    ...options.plugins,
    // typescript({
    //   tsconfig: 'libs/island-ui/core/tsconfig.lib.json',
    // }),
    // rollupPluginTreat({
    //   // include: /\.treat\.(ts|js)$/,
    //   include: /[\.treat|colors|escapeGrid|responsiveRangeProps|responsiveStyleMap|theme]*\.(ts|tsx|js)$/,
    //   outputCSS: 'treat.css',
    // }),
  ]

  return options
}

module.exports = getRollupOptions
