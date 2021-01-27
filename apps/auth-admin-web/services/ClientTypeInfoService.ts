import ClientTypeInfo from '../entities/common/ClientTypeInfo'

export class ClientTypeInfoService {
  public static getClientTypeInfo(clientType: string): ClientTypeInfo {
    switch (clientType) {
      case 'spa':
        return ClientTypeInfoService.getSpaClientTypeInfo()
      case 'native':
        return ClientTypeInfoService.getNativeClientTypeInfo()
      case 'web':
        return ClientTypeInfoService.getWebClientTypeInfo()
      case 'machine':
        return ClientTypeInfoService.getMachineClientTypeInfo()
      case 'device':
        return ClientTypeInfoService.getDeviceClientTypeInfo()
      default:
        return ClientTypeInfoService.getSelectClientTypeInfo()
    }
  }

  private static getSelectClientTypeInfo(): ClientTypeInfo {
    return {
      title: 'Please select a Client Type',
      flow: null,
      description:
        'You need to select the appropriate Client Type. Information about each type will be shown here when you change the selection.',
      urlText: 'More information about Client Types',
      url: 'http://todo#types',
    }
  }

  private static getSpaClientTypeInfo(): ClientTypeInfo {
    return {
      title: 'SPA Client',
      flow: 'Authorization code flow + PKCE',
      description:
        "A single-page application (spa) doesn't need to reload the page during its use and works within a browser, e.g. Facebook. Since it is running in the users browser, it cannot keep a secret.",
      urlText: 'More information about SPA Clients',
      url: 'http://todo#spa',
    }
  }

  private static getNativeClientTypeInfo(): ClientTypeInfo {
    return {
      title: 'Native Client',
      flow: 'Authorization code flow + PKCE',
      description:
        'A native application is designed specifically for use on a particular platform or device. Since it runs on user´s devices it cannot keep a secret',
      urlText: 'More information about Native Clients',
      url: 'http://todo#native',
    }
  }

  private static getWebClientTypeInfo(): ClientTypeInfo {
    return {
      title: 'Web Client',
      flow: 'Hybrid flow with client authentication',
      description:
        'A web application runs on a web server and is accessed by a web browser. Examples of common web applications are online banking and online retail sales. Is capable of keeping a secret',
      urlText: 'More information about Web Clients',
      url: 'http://todo#web',
    }
  }

  private static getMachineClientTypeInfo(): ClientTypeInfo {
    return {
      title: 'Machine Client Type',
      flow: 'Hybrid flow with client authentication',
      description:
        'An application or service running on a confidential server. This type of application is capable of keeping a secret.',
      urlText: 'More information about Machine Clients',
      url: 'http://todo#machine',
    }
  }

  private static getDeviceClientTypeInfo(): ClientTypeInfo {
    return {
      title: 'Device Type Client',
      flow: 'Device flow using external browser',
      description: 'Description for this client type is not present',
      urlText: 'More information about Device Clients Types',
      url: 'http://todo#device',
    }
  }
}
