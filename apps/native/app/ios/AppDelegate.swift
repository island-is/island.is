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
class AppDelegate: RNNAppDelegate {
    var authorizationFlowManagerDelegate: OIDExternalUserAgentSession?
  
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        FirebaseApp.configure()
        moduleName = "IslandApp"
        dependencyProvider = RCTAppDependencyProvider()

        // You can add your custom initial props in the dictionary below.
        // They will be passed down to the ViewController used by React Native.
        initialProps = [:]

        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
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
        return RCTLinkingManager.application(
            application,
            continue: userActivity,
            restorationHandler: restorationHandler
        )
    }

    override func sourceURL(for _: RCTBridge) -> URL? {
        bundleURL()
    }

    override func bundleURL() -> URL? {
        #if DEBUG
            RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
            Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
}
