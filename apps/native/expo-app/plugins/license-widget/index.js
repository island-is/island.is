const {
  withXcodeProject,
  withDangerousMod,
  withAndroidManifest,
  withStringsXml,
  AndroidConfig,
} = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

const WIDGET_NAME = 'LicenseWidget'
const SWIFT_SOURCES = ['LicenseWidget.swift', 'LicenseWidgetBundle.swift', 'AppIntent.swift']
// Info.plist is handled by INFOPLIST_FILE build setting — do NOT add to Resources phase
const RESOURCE_FILES = ['Assets.xcassets']

// ─── Helpers ────────────────────────────────────────────────────────────────

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    entry.isDirectory() ? copyDirSync(srcPath, destPath) : fs.copyFileSync(srcPath, destPath)
  }
}

// ─── iOS: copy source files into ios/LicenseWidget/ ─────────────────────────

function withLicenseWidgetIosFiles(config) {
  return withDangerousMod(config, [
    'ios',
    (mod) => {
      const src = path.join(__dirname, 'ios')
      const dest = path.join(mod.modRequest.projectRoot, 'ios', WIDGET_NAME)
      copyDirSync(src, dest)
      return mod
    },
  ])
}

// ─── iOS: add widget extension target to Xcode project ───────────────────────

function withLicenseWidgetXcodeProject(config) {
  return withXcodeProject(config, (mod) => {
    const proj = mod.modResults
    const appBundleId = config.ios?.bundleIdentifier ?? 'is.island.app'
    const widgetBundleId = `${appBundleId}.LicenseWidget`

    // Idempotency: skip if target already exists
    const nativeTargets = proj.pbxNativeTargetSection()
    const alreadyAdded = Object.values(nativeTargets).some(
      (t) => typeof t === 'object' && t.name === WIDGET_NAME,
    )
    if (alreadyAdded) return mod

    // 1. Add the extension target
    const target = proj.addTarget(WIDGET_NAME, 'app_extension', WIDGET_NAME, widgetBundleId)

    // 2. Create a PBX group and attach it to the project's main group
    // Info.plist is listed in the group for Xcode visibility but NOT in the Resources
    // build phase — it is handled exclusively via the INFOPLIST_FILE build setting.
    const { uuid: groupUuid } = proj.addPbxGroup(
      [...SWIFT_SOURCES, ...RESOURCE_FILES, 'Info.plist'],
      WIDGET_NAME,
      WIDGET_NAME,
    )
    const mainGroupKey = proj.getFirstProject().firstProject.mainGroup
    proj.addToPbxGroup(groupUuid, mainGroupKey)

    // 3. Build phases
    proj.addBuildPhase(SWIFT_SOURCES, 'PBXSourcesBuildPhase', 'Sources', target.uuid)
    proj.addBuildPhase([], 'PBXFrameworksBuildPhase', 'Frameworks', target.uuid)
    proj.addBuildPhase(RESOURCE_FILES, 'PBXResourcesBuildPhase', 'Resources', target.uuid)

    // 4. Link WidgetKit and SwiftUI (weak/optional — they are system frameworks)
    proj.addFramework('WidgetKit.framework', { target: target.uuid, link: false })
    proj.addFramework('SwiftUI.framework', { target: target.uuid, link: false })

    // 4b. Wire up PBXContainerItemProxy + PBXTargetDependency so the main app
    //     target declares a proper build dependency on the widget extension.
    //     addTarget() does NOT do this automatically.
    const objs = proj.hash.project.objects
    const projectPortalUuid = proj.getFirstProject().uuid
    const mainTargetUuid = Object.keys(proj.pbxNativeTargetSection()).find(
      (k) => proj.pbxNativeTargetSection()[k]?.name === mod.modRequest.projectName,
    )

    if (mainTargetUuid) {
      const proxyUuid = proj.generateUuid()
      const depUuid = proj.generateUuid()

      objs['PBXContainerItemProxy'] = objs['PBXContainerItemProxy'] ?? {}
      objs['PBXContainerItemProxy'][proxyUuid] = {
        isa: 'PBXContainerItemProxy',
        containerPortal: projectPortalUuid,
        proxyType: 1,
        remoteGlobalIDString: target.uuid,
        remoteInfo: WIDGET_NAME,
      }

      objs['PBXTargetDependency'] = objs['PBXTargetDependency'] ?? {}
      objs['PBXTargetDependency'][depUuid] = {
        isa: 'PBXTargetDependency',
        target: target.uuid,
        targetProxy: proxyUuid,
      }

      const mainTarget = proj.pbxNativeTargetSection()[mainTargetUuid]
      if (!mainTarget.dependencies) mainTarget.dependencies = []
      mainTarget.dependencies.push({ value: depUuid, comment: 'PBXTargetDependency' })
    }

    // 5. Build settings — walk the configurations owned by our new target
    const objects = proj.hash.project.objects
    const configListKey = target.pbxNativeTarget.buildConfigurationList
    const configList = objs['XCConfigurationList'][configListKey]

    const developmentTeam = config.ios?.appleTeamId ?? ''

    // Shared settings (both Debug and Release)
    const sharedSettings = {
      ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS: 'YES',
      ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME: 'AccentColor',
      ASSETCATALOG_COMPILER_WIDGET_BACKGROUND_COLOR_NAME: 'WidgetBackground',
      CLANG_ANALYZER_NONNULL: 'YES',
      CLANG_ANALYZER_NUMBER_OBJECT_CONVERSION: 'YES_AGGRESSIVE',
      CLANG_CXX_LANGUAGE_STANDARD: '"gnu++20"',
      CLANG_ENABLE_OBJC_WEAK: 'YES',
      CLANG_WARN_DOCUMENTATION_COMMENTS: 'YES',
      CLANG_WARN_UNGUARDED_AVAILABILITY: 'YES_AGGRESSIVE',
      CODE_SIGN_IDENTITY: '"Apple Development"',
      CODE_SIGN_STYLE: 'Automatic',
      COPY_PHASE_STRIP: 'NO',
      CURRENT_PROJECT_VERSION: '1',
      DEVELOPMENT_TEAM: developmentTeam,
      ENABLE_USER_SCRIPT_SANDBOXING: 'YES',
      GCC_C_LANGUAGE_STANDARD: 'gnu17',
      GENERATE_INFOPLIST_FILE: 'YES',
      INFOPLIST_FILE: `"${WIDGET_NAME}/Info.plist"`,
      INFOPLIST_KEY_CFBundleDisplayName: WIDGET_NAME,
      INFOPLIST_KEY_NSHumanReadableCopyright: '""',
      IPHONEOS_DEPLOYMENT_TARGET: '17.6',
      LD_RUNPATH_SEARCH_PATHS: '("$(inherited)", "@executable_path/Frameworks", "@executable_path/../../Frameworks")',
      LOCALIZATION_PREFERS_STRING_CATALOGS: 'YES',
      MARKETING_VERSION: '"1.0"',
      PRODUCT_BUNDLE_IDENTIFIER: `"${widgetBundleId}"`,
      PRODUCT_NAME: '"$(TARGET_NAME)"',
      PROVISIONING_PROFILE_SPECIFIER: '""',
      SKIP_INSTALL: 'YES',
      SWIFT_EMIT_LOC_STRINGS: 'YES',
      SWIFT_VERSION: '"5.0"',
      TARGETED_DEVICE_FAMILY: '"1,2"',
    }

    for (const { value: configKey } of configList.buildConfigurations) {
      const bc = objs['XCBuildConfiguration'][configKey]
      if (!bc?.buildSettings) continue

      const isRelease = bc.name === 'Release'

      Object.assign(bc.buildSettings, sharedSettings, {
        CODE_SIGN_ENTITLEMENTS: isRelease
          ? `${WIDGET_NAME}/LicenseWidgetExtensionRelease.entitlements`
          : `${WIDGET_NAME}/LicenseWidgetExtension.entitlements`,
        DEBUG_INFORMATION_FORMAT: isRelease ? '"dwarf-with-dsym"' : 'dwarf',
        MTL_FAST_MATH: isRelease ? 'YES' : undefined,
        OTHER_SWIFT_FLAGS: isRelease
          ? '"$(inherited) -D EXPO_CONFIGURATION_RELEASE"'
          : '"$(inherited) -D EXPO_CONFIGURATION_DEBUG"',
        SWIFT_COMPILATION_MODE: isRelease ? 'wholemodule' : undefined,
      })

      // Remove keys set to undefined
      for (const key of Object.keys(bc.buildSettings)) {
        if (bc.buildSettings[key] === undefined) delete bc.buildSettings[key]
      }
    }

    return mod
  })
}

// ─── iOS: register widget extension for EAS builds ───────────────────────────

function withLicenseWidgetEas(config) {
  const appBundleId = config.ios?.bundleIdentifier ?? 'is.island.app'
  const widgetBundleId = `${appBundleId}.LicenseWidget`

  const existing = config.extra?.eas?.build?.experimental?.ios?.appExtensions ?? []
  const alreadyAdded = existing.some((e) => e.targetName === WIDGET_NAME)
  if (alreadyAdded) return config

  return {
    ...config,
    extra: {
      ...config.extra,
      eas: {
        ...(config.extra?.eas ?? {}),
        build: {
          ...(config.extra?.eas?.build ?? {}),
          experimental: {
            ...(config.extra?.eas?.build?.experimental ?? {}),
            ios: {
              ...(config.extra?.eas?.build?.experimental?.ios ?? {}),
              appExtensions: [
                ...existing,
                { targetName: WIDGET_NAME, bundleIdentifier: widgetBundleId },
              ],
            },
          },
        },
      },
    },
  }
}

// ─── Android: copy Java sources and res files ─────────────────────────────────

function withLicenseWidgetAndroidFiles(config) {
  return withDangerousMod(config, [
    'android',
    (mod) => {
      const pkg = config.android?.package ?? 'is.island.app'
      const pkgPath = pkg.replace(/\./g, '/')
      const projectRoot = mod.modRequest.projectRoot

      // Java sources → correct package directory
      const javaSrc = path.join(__dirname, 'android', 'java')
      const javaDest = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'java',
        pkgPath,
      )
      fs.mkdirSync(javaDest, { recursive: true })

      for (const file of fs.readdirSync(javaSrc)) {
        let content = fs.readFileSync(path.join(javaSrc, file), 'utf8')
        // Patch all occurrences of the original package in a single pass to avoid
        // double-replacement (e.g. is.island.app → is.island.app.dev → is.island.app.dev.dev)
        if (pkg !== 'is.island.app') {
          content = content.replace(/is\.island\.app/g, pkg)
        }
        fs.writeFileSync(path.join(javaDest, file), content, 'utf8')
      }

      // res/ → android/app/src/main/res/ (merges into existing tree)
      const resSrc = path.join(__dirname, 'android', 'res')
      const resDest = path.join(projectRoot, 'android', 'app', 'src', 'main', 'res')
      copyDirSync(resSrc, resDest)

      // Patch the configure attribute in license_widget_info.xml if package differs
      if (pkg !== 'is.island.app') {
        const infoXml = path.join(resDest, 'xml', 'license_widget_info.xml')
        const xmlContent = fs.readFileSync(infoXml, 'utf8')
        fs.writeFileSync(infoXml, xmlContent.replace(/is\.island\.app/g, pkg), 'utf8')
      }

      return mod
    },
  ])
}

// ─── Android: manifest — receiver + config activity ──────────────────────────

function withLicenseWidgetAndroidManifest(config) {
  return withAndroidManifest(config, (mod) => {
    const pkg = config.android?.package ?? 'is.island.app'
    const mainApp = AndroidConfig.Manifest.getMainApplicationOrThrow(mod.modResults)

    if (!mainApp.receiver) mainApp.receiver = []
    if (!mainApp.activity) mainApp.activity = []

    const receiverName = `${pkg}.LicenseWidgetProvider`
    const activityName = `${pkg}.LicenseWidgetConfigActivity`

    // Idempotency guards
    const hasReceiver = mainApp.receiver.some((r) => r.$?.['android:name'] === receiverName)
    const hasActivity = mainApp.activity.some((a) => a.$?.['android:name'] === activityName)

    if (!hasReceiver) {
      mainApp.receiver.push({
        $: { 'android:name': receiverName, 'android:exported': 'false' },
        'intent-filter': [
          {
            action: [
              { $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } },
            ],
          },
        ],
        'meta-data': [
          {
            $: {
              'android:name': 'android.appwidget.provider',
              'android:resource': '@xml/license_widget_info',
            },
          },
        ],
      })
    }

    if (!hasActivity) {
      mainApp.activity.push({
        $: { 'android:name': activityName, 'android:exported': 'false' },
        'intent-filter': [
          {
            action: [
              { $: { 'android:name': 'android.appwidget.action.APPWIDGET_CONFIGURE' } },
            ],
          },
        ],
      })
    }

    return mod
  })
}

// ─── Android: strings.xml — widget description ───────────────────────────────

function withLicenseWidgetAndroidStrings(config) {
  return withStringsXml(config, (mod) => {
    const strings = mod.modResults.resources.string ?? []
    const key = 'license_widget_description'

    if (!strings.some((s) => s.$?.name === key)) {
      strings.push({ $: { name: key }, _: 'Flýtileið á skírteini' })
      mod.modResults.resources.string = strings
    }

    return mod
  })
}

// ─── Compose ─────────────────────────────────────────────────────────────────

const withLicenseWidget = (config) => {
  // iOS
  config = withLicenseWidgetIosFiles(config)
  config = withLicenseWidgetXcodeProject(config)
  config = withLicenseWidgetEas(config)

  // Android
  config = withLicenseWidgetAndroidFiles(config)
  config = withLicenseWidgetAndroidManifest(config)
  config = withLicenseWidgetAndroidStrings(config)

  return config
}

module.exports = withLicenseWidget
