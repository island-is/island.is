#import "ReactNativeNavigation.h"
#import "RNIsland.h"
#import <SafariServices/SafariServices.h>

@implementation RNIsland

- (dispatch_queue_t) methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(overrideUserInterfaceStyle:(NSString *)uiStyle) {
  NSArray<__kindof UIWindow*>* windows = RCTSharedApplication().windows;
  if (@available(iOS 13.0, *)) {
    for (UIWindow *window in windows)
    {
      if ([uiStyle isEqualToString:@"dark"]) {
        window.overrideUserInterfaceStyle = UIUserInterfaceStyleDark;
      } else if ([uiStyle isEqualToString:@"light"]) {
        window.overrideUserInterfaceStyle = UIUserInterfaceStyleLight;
      } else if ([uiStyle isEqualToString:@"automatic"]) {
        window.overrideUserInterfaceStyle = UIUserInterfaceStyleUnspecified;
      }
    }
  }
}

RCT_EXPORT_METHOD(openSafari:(NSString *)componentId options:(NSDictionary *)options) {

  NSString* url = [options valueForKey:@"url"];
  NSNumber* preferredBarTintColor = [options valueForKey:@"preferredBarTintColor"];
  NSNumber* preferredControlTintColor = [options valueForKey:@"preferredControlTintColor"];
  NSString* dismissButtonStyle = [options valueForKey:@"dismissButtonStyle"];

  UIViewController *vc = [ReactNativeNavigation findViewController:componentId];

  SFSafariViewController *safariViewController = [[SFSafariViewController alloc] initWithURL:[[NSURL alloc] initWithString:url]];

  if (preferredBarTintColor) {
    safariViewController.preferredBarTintColor = [RCTConvert UIColor:preferredBarTintColor];
  }

  if (preferredControlTintColor) {
    safariViewController.preferredControlTintColor = [RCTConvert UIColor:preferredControlTintColor];
  }

  if (@available(iOS 11.0, *)) {
    if ([dismissButtonStyle isEqualToString:@"done"]) {
      safariViewController.dismissButtonStyle = SFSafariViewControllerDismissButtonStyleDone;
    }
    if ([dismissButtonStyle isEqualToString:@"close"]) {
      safariViewController.dismissButtonStyle = SFSafariViewControllerDismissButtonStyleClose;
    }
    if ([dismissButtonStyle isEqualToString:@"cancel"]) {
      safariViewController.dismissButtonStyle = SFSafariViewControllerDismissButtonStyleCancel;
    }
  }

  (void)safariViewController.view;

  if (@available(iOS 13.0, *)) {
    safariViewController.modalPresentationStyle = UIModalPresentationAutomatic;
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    [vc presentViewController:safariViewController animated:YES completion:nil];
  });
}

RCT_EXPORT_METHOD(setPreferencesValue:(NSString *)key value:(NSString *)value suite:(NSString *)suite)
{
  NSUserDefaults *prefs = [[NSUserDefaults alloc] initWithSuiteName:suite];
  [prefs setObject:value forKey:key];
  [prefs synchronize];
}

@end
