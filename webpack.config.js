module.exports = (config, context) => {
  // removing the externals config to make sure webpack bundles all dependencies in the output bundle
  // return { ...config, externals: undefined }
  return { ...config }
}
