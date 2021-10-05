package is.island.app;

import is.island.app.generated.BasePackageList;
import is.island.app.IslandPackage;

// npm packages
import com.rnappauth.RNAppAuthPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.microsoft.codepush.react.CodePush;
import com.reactnativecommunity.cookies.CookieManagerPackage;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.oblador.keychain.KeychainPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationPackage;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativeultimateconfig.UltimateConfigPackage;
import com.reactnativeultimateconfig.UltimateConfigModule;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import io.sentry.react.RNSentryPackage;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
import io.invertase.firebase.perf.ReactNativeFirebasePerfPackage;
import com.wix.interactable.Interactable;
import com.github.droibit.android.reactnative.customtabs.CustomTabsPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import org.wonday.pdf.RCTPdfView;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativecommunity.progressview.RNCProgressViewPackage;
import com.reactnativecommunity.androidprogressbar.RNCProgressBarPackage;
import cl.json.RNSharePackage;

// unimodules
import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
import org.unimodules.core.interfaces.SingletonModule;

// android and react native
import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Arrays;


public class MainApplication extends NavigationApplication {
  private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(new BasePackageList().getPackageList(), null);

  private final ReactNativeHost mReactNativeHost =
      new NavigationReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          packages.add(new IslandPackage());
          packages.add(new AsyncStoragePackage());
          packages.add(new CodePush(BuildConfig.CODEPUSH_DEPLOYMENT_KEY_ANDROID, MainApplication.this, BuildConfig.DEBUG));
          packages.add(new CookieManagerPackage());
          packages.add(new KeychainPackage());
          packages.add(new NavigationPackage(mReactNativeHost));
          packages.add(new ReactNativeDialogsPackage());
          packages.add(new RNAppAuthPackage());
          packages.add(new RNCWebViewPackage());
          packages.add(new UltimateConfigPackage());
          packages.add(new RNSentryPackage());
          packages.add(new ReactNativeFirebaseAppPackage());
          packages.add(new ReactNativeFirebaseMessagingPackage());
          packages.add(new ReactNativeFirebasePerfPackage());
          packages.add(new Interactable());
          packages.add(new CustomTabsPackage());
          packages.add(new RandomBytesPackage());
          packages.add(new RCTPdfView());
          packages.add(new RNFetchBlobPackage());
          packages.add(new RNCProgressViewPackage());
          packages.add(new RNCProgressBarPackage());
          packages.add(new RNSharePackage());

          // Unimodules
          List<ReactPackage> unimodules = Arrays.<ReactPackage>asList(
            new ModuleRegistryAdapter(mModuleRegistryProvider)
          );
          packages.addAll(unimodules);
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "apps/native/app/src/main";
        }

        @Override
        protected String getJSBundleFile() {
          return CodePush.getJSBundleFile();
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    UltimateConfigModule.setBuildConfig(BuildConfig.class);
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("is.island.app.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
