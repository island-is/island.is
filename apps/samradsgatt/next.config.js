// eslint-disable-next-line @typescript-eslint/no-var-requires

const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = { presets: ['next/babel'] }

module.exports = withVanillaExtract(nextConfig)
