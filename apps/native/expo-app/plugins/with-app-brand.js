const { withStringsXml, withDangerousMod } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

const ADAPTIVE_ICON_FILES = [
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
]

/**
 * Sets android:inset on the <foreground> element of adaptive icon XMLs.
 */
const withAdaptiveIconInset = (config, inset = '10%') => {
  return withDangerousMod(config, [
    'android',
    (mod) => {
      const root = mod.modRequest.projectRoot

      for (const file of ADAPTIVE_ICON_FILES) {
        const filePath = path.join(root, file)
        if (!fs.existsSync(filePath)) continue

        let content = fs.readFileSync(filePath, 'utf8')

        content = content.replace(
          /(<foreground\b[^>]*?)(\/?>)/g,
          (match, attrs, closing) => {
            if (attrs.includes('android:inset')) return match
            return `${attrs} android:inset="${inset}"${closing}`
          },
        )

        fs.writeFileSync(filePath, content, 'utf8')
      }

      return mod
    },
  ])
}

/**
 * Sets the Android app_name string resource to match config.displayName.
 */
const withAndroidAppName = (config) => {
  return withStringsXml(config, (mod) => {
    const strings = mod.modResults.resources.string ?? []
    const appName = config.displayName ?? config.name
    const existing = strings.find((s) => s.$?.name === 'app_name')

    if (existing) {
      existing._ = appName
    } else {
      strings.push({ $: { name: 'app_name' }, _: appName })
      mod.modResults.resources.string = strings
    }

    return mod
  })
}

const withAppBrand = (config) => {
  config = withAndroidAppName(config)
  config = withAdaptiveIconInset(config)
  return config
}

module.exports = withAppBrand
