//
//  AppDelegate.swift
//  IslandApp
//
//  Created by Snær Þóroddsson on 15.7.2025.
//

import AppAuth
import FirebaseCore
import React
import ReactAppDependencyProvider
import ReactNativeNavigation
import UIKit

@main
class AppDelegate: RNNAppDelegate, RNAppAuthAuthorizationFlowManager {
    // var window: UIWindow?

    // var reactNativeDelegate: ReactNativeDelegate?
    // var reactNativeFactory: RCTReactNativeFactory?

    weak var authorizationFlowManagerDelegate: RNAppAuthAuthorizationFlowManagerDelegate?

    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        self.moduleName = "index"
        FirebaseApp.configure()

        return super.application(application, didFinishLaunchingWithOptions: launchOptions)

        // let delegate = ReactNativeDelegate()
        // let factory = RCTReactNativeFactory(delegate: delegate)
        // delegate.dependencyProvider = RCTAppDependencyProvider()
    
        // reactNativeDelegate = delegate
        // reactNativeFactory = factory
    
        // window = UIWindow(frame: UIScreen.main.bounds)
    
        // factory.startReactNative(
        //     withModuleName: "RnDiffApp",
        //     in: window,
        //     launchOptions: launchOptions
        // )
    
        // return true
    }

    override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        if let delegate = authorizationFlowManagerDelegate, delegate.resumeExternalUserAgentFlow(with: url) {
            return true
        }

        return RCTLinkingManager.application(app, open: url, options: options)
    }

    override func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        // Handle AppAuth web flow
        if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
           let delegate = authorizationFlowManagerDelegate,
           delegate.resumeExternalUserAgentFlow(with: userActivity.webpageURL)
        {
            return true
        }

        // Spotlight Search
        RCTSpotlightSearch.handleContinue(userActivity)

        // React Native Linking fallback
        return RCTLinkingManager.application(
            application,
            continue: userActivity,
            restorationHandler: restorationHandler
        )
    }

    override func application(
        _: UIApplication,
        performActionFor shortcutItem: UIApplicationShortcutItem,
        completionHandler: @escaping (Bool) -> Void
    ) {
        // Handle quick actions
        RNQuickActionManager.onQuickActionPress(shortcutItem, completionHandler: completionHandler)
    }

    override func extraModules(for bridge: RCTBridge) -> [RCTBridgeModule] {
        return super.extraModules(for: bridge)
    }

    override func bundleURL() -> URL? {
        #if DEBUG
            return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
            return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
}
