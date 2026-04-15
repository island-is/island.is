//
//  LicenseWidget.swift
//  LicenseWidget
//
//  Created by Birkir Rafn Gudjonsson on 22.6.2025.
//

import WidgetKit
import SwiftUI

struct Provider: AppIntentTimelineProvider {
  func placeholder(in context: Context) -> LicenseEntry {
    LicenseEntry(
      date: Date(),
      configuration: ConfigurationAppIntent(),
      licensePayload: sampleLicensePayload()
    )
  }
  
  func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> LicenseEntry {
    let licensePayload = loadLicensePayload(for: configuration)
    return LicenseEntry(
      date: Date(),
      configuration: configuration,
      licensePayload: licensePayload
    )
  }
  
  func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<LicenseEntry> {
    let licensePayload = loadLicensePayload(for: configuration)
    var entries: [LicenseEntry] = []
    let currentDate = Date()
    for minuteOffset in stride(from: 0, to: 120, by: 30) {
      let entryDate = Calendar.current.date(byAdding: .minute, value: minuteOffset, to: currentDate)!
      let entry = LicenseEntry(
        date: entryDate,
        configuration: configuration,
        licensePayload: licensePayload
      )
      entries.append(entry)
    }
    return Timeline(entries: entries, policy: .atEnd)
  }
  
  private func sampleLicensePayload() -> LicensePayload {
    LicensePayload(
      type: "DriversLicense",
      nationalId: "0101010000",
      licenseNumber: "123456789",
      licenseId: "987654321",
      name: "Jón Jónsson",
      title: "Ökuskírteini",
      subtitle: "B-flokkur",
      photo: nil,
      uri: nil
    )
  }
  
  private func loadLicensePayload(for configuration: ConfigurationAppIntent) -> LicensePayload? {
    let bundleId = (Bundle.main.bundleIdentifier ?? "is.island.app").replacingOccurrences(of: ".LicenseWidget", with: "")
    let suiteName = "group.\(bundleId)"
    let defaults = UserDefaults(suiteName: suiteName)
    let rawJSON = defaults?.string(forKey: "widget_licenses") ?? "[]"
//    print("passed data: \(rawJSON)")
    guard let data = rawJSON.data(using: .utf8) else {
      return nil
    }
    
    do {
      let decoder = JSONDecoder()
      let licenses = try decoder.decode([LicensePayload].self, from: data)
      let licenseType = (configuration.licenseType ?? .driversLicense).systemName
      let foundLicense = licenses.first { license in
        if let type = license.type {
          return type.lowercased() == licenseType.lowercased()
        }
        return false
      }
      return foundLicense
    } catch {
      print("error in decoding licenses: \(error)")
      return nil
    }
  }
  
  private func loadEntry() -> LicenseEntry {
    return LicenseEntry(date: Date(), configuration: ConfigurationAppIntent(), licensePayload: nil)
  }
}

struct LicenseEntry: TimelineEntry {
  let date: Date
  let configuration: ConfigurationAppIntent
  let licensePayload: LicensePayload?
}

struct LicensePayload: Codable {
  let type: String?
  // let status: String?
  let nationalId: String?
  let licenseNumber: String?
  let licenseId: String?
  // let expired: Bool?
  // let expireDate: String?
  // let expiryStatus: String?
  let name: String?
  let title: String?
  let subtitle: String?
  let photo: String?
  // let displayTag: String?
  let uri: String?
  
  var photoData: Data? {
    guard let photo = photo else {
      return nil
    }

    // Handle data URLs with MIME type prefix
    if photo.hasPrefix("data:") {
      let components = photo.components(separatedBy: ",")
      guard components.count == 2,
            components[0].contains("base64") else {
        return nil
      }
      return Data(base64Encoded: components[1])
    }

    // Handle plain base64
    return Data(base64Encoded: photo)
  }
}

struct LicenseWidgetEntryView : View {
  var entry: Provider.Entry
  @Environment(\.widgetFamily) var family
  
  var showInfo: Bool { entry.configuration.showInfo ?? true }
  var currentLicenseType: LicenseType { entry.configuration.licenseType ?? .driversLicense }
  var agencyLogoSize : CGFloat { family == .systemSmall && !showInfo ? 32 : 40 }
  
  var agencyView: some View {
    HStack(alignment: .center) {
      Image(currentLicenseType.iconName)
        .resizable()
        .frame(width: agencyLogoSize, height: agencyLogoSize)
        .foregroundColor(.primary)
      if (family != .systemSmall && showInfo) {
        Text(entry.licensePayload?.name ?? currentLicenseType.displayTitle)
          .font(.system(size: 16))
          .fontWeight(.semibold)
          .foregroundColor(Color(hex: "#00003C"))
      }
    }
  }
  
  @ViewBuilder
  var infoView: some View {
    if let license = entry.licensePayload {
      VStack(alignment: .leading, spacing: 2) {
        if let title = license.title, !title.isEmpty {
          Text(title)
            .font(.system(size: 20))
            .fontWeight(.semibold)
            .foregroundColor(Color(hue: 0.66, saturation: 1, brightness: 0.12))
            .lineLimit(1)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        if let subtitle = license.subtitle, !subtitle.isEmpty {
          Text(subtitle)
            .font(.system(size: 12))
            .foregroundColor(Color(hue: 0.66, saturation: 1, brightness: 0.12).opacity(0.8))
            .lineLimit(1)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
      }
    }
  }
  
  var licenseTypeView: some View {
    let displayText = entry.licensePayload?.title ?? (entry.configuration.licenseType ?? .driversLicense).displayTitle
    
    return Text(displayText)
      .font(.system(size: 18, weight: Font.Weight.semibold))
      .foregroundColor(Color(hue: 0.66, saturation: 1, brightness: 0.12))
  }
  
  
  @ViewBuilder
  var photoView: some View {
    if let license = entry.licensePayload {
      if let photoData = license.photoData {
        if let uiImage = UIImage(data: photoData) {
          Image(uiImage: uiImage)
            .resizable()
            .aspectRatio(contentMode: .fill)
            .frame(width: family == .systemSmall ? 50 : 64, height: family == .systemSmall ? 56 : 72)
            .clipShape(RoundedRectangle(cornerRadius: 8))
        }
      }
    }
  }
  
  var callbackURL: URL? {
    let bundleId = (Bundle.main.bundleIdentifier ?? "is.island.app").replacingOccurrences(of: ".LicenseWidget", with: "")
    if let license = entry.licensePayload {
      if let uri = license.uri, !uri.isEmpty {
        return URL(string: uri)
      }
      if let type = license.type, !type.isEmpty {
        if let licenseId = license.licenseId, !licenseId.isEmpty {
          let urlString = "\(bundleId)://wallet/\(type)/\(licenseId)"
          return URL(string: urlString)
        } else {
          let urlString = "\(bundleId)://wallet/\(type)"
          return URL(string: urlString)
        }
      }
    }
    return URL(string: "\(bundleId)://wallet")
  }
  
  var body: some View {
    switch (family) {
    case .accessoryCircular,
        .accessoryRectangular,
        .accessoryInline:
      AccessoryLicenseView()
    default:
      VStack(alignment: .leading) {
        HStack(alignment: .top) {
          agencyView
          Spacer()
          if showInfo {
            photoView
          }
        }
        Spacer()
        if showInfo && family != .systemSmall {
          infoView
        } else {
          HStack {
            licenseTypeView
            Spacer()
          }
        }
      }
      .widgetURL(callbackURL)
    }
  }
  
}

struct AccessoryLicenseView : View {
  @Environment(\.widgetFamily) var family
  
  var body: some View {
    let bundleId = (Bundle.main.bundleIdentifier ?? "is.island.app").replacingOccurrences(of: ".LicenseWidget", with: "")
    var openURL = URL(string: "\(bundleId)://wallet/DriversLicense/default")!;
    switch family {
    case .accessoryInline:
      Text("Ökuskírteini")
        .font(.system(size: 14, weight: .medium))
        .foregroundColor(.white)
        .lineLimit(1)
        .widgetURL(openURL)
      
    case .accessoryCircular:
      ZStack {
        Color.black.opacity(0.4)
        Image("WalletIcon")
          .resizable()
          .aspectRatio(contentMode: .fit)
          .frame(width: 26, height: 26)
          .foregroundColor(.white)
          .privacySensitive(false)
          .unredacted()
      }
      .clipShape(Circle())
      .widgetURL(openURL)
      
    case .accessoryRectangular:
      ZStack {
        Color.black.opacity(0.4)
        HStack(spacing: 6) {
          Image("WalletIcon")
            .resizable()
            .aspectRatio(contentMode: .fit)
            .frame(width: 22, height: 22)
            .foregroundColor(.white)
            .privacySensitive(false)
            .unredacted()

          Text("Ökuskírteini")
            .font(.system(size: 14, weight: .medium))
            .foregroundColor(.white)
            .lineLimit(1)
            .privacySensitive(false)
            .unredacted()
        }
      }
      .clipShape(RoundedRectangle(cornerRadius: 8))
      .widgetURL(openURL)
    default:
      Text("Unsupported widget family")
    }
  }
}

struct LicenseNotFoundView : View {
  @Environment(\.widgetFamily) var family
  var entry: Provider.Entry
  var body: some View {
    switch (family) {
    case .accessoryCircular,
        .accessoryRectangular,
        .accessoryInline:
      AccessoryLicenseView()
    default:
      VStack(alignment: .center) {
        Image(systemName: "exclamationmark.triangle.fill")
          .resizable()
          .frame(width: 32, height: 32)
          .foregroundColor(.red)
        Text("\(entry.configuration.licenseType?.displayTitle ?? "Skírteini") fannst ekki")
          .font(.headline)
          .foregroundColor(.primary)
          .padding(.top, 8)
        Text("Skoða öll skírteini")
          .font(.caption)
          .foregroundColor(.secondary)
          .padding(.top, 1)
      }
      .padding()
    }
  }
}

struct LicenseWidget: Widget {
  @Environment(\.widgetFamily) var family
  let kind: String = "LicenseWidget"
  
  var body: some WidgetConfiguration {
    AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
      if entry.licensePayload != nil {
        LicenseWidgetEntryView(entry: entry)
          .containerBackground(for: .widget) {
            LinearGradient(
              colors: (entry.configuration.licenseType ?? .driversLicense).backgroundColors,
              startPoint: .top,
              endPoint: .bottom
            )
          }
          .padding(0)
      } else {
        LicenseNotFoundView(entry: entry)
          .containerBackground(for: .widget) {
            LinearGradient(
              colors: [Color.gray.opacity(0.1), Color.gray.opacity(0.2)],
              startPoint: .top,
              endPoint: .bottom
            )
          }
          .padding(0)
      }
    }
    .configurationDisplayName("Skírteini")
    .description("Stilltu hvaða skírteini þú vilt birta")
    .supportedFamilies([
      .systemSmall,
      .systemMedium,
      // Lock screen
      .accessoryCircular,
      .accessoryRectangular,
    ])
  }
}

extension ConfigurationAppIntent {
  fileprivate static var driversLicense: ConfigurationAppIntent {
    return ConfigurationAppIntent(licenseType: .driversLicense, showInfo: true)
  }
  
  fileprivate static var huntingLicense: ConfigurationAppIntent {
    return ConfigurationAppIntent(licenseType: .huntingLicense, showInfo: false)
  }
  
  fileprivate static var disabilityLicense: ConfigurationAppIntent {
    return ConfigurationAppIntent(licenseType: .disabilityLicense, showInfo: true)
  }
}

#Preview(as: .systemSmall) {
  LicenseWidget()
} timeline: {
  LicenseEntry(date: .now, configuration: .driversLicense, licensePayload: nil)
  LicenseEntry(date: .now, configuration: .huntingLicense, licensePayload: LicensePayload(
    type: "HuntingLicense",
    nationalId: "0101010000",
    licenseNumber: "123456789",
    licenseId: "987654321",
    name: "Jón Jónsson",
    title: "Veiðikort",
    subtitle: "Stangaveiði",
    photo: nil,
    uri: nil
  ))
  LicenseEntry(date: .now, configuration: .disabilityLicense, licensePayload: LicensePayload(
    type: "DisabilityLicense",
    nationalId: "0101010000",
    licenseNumber: "987654321",
    licenseId: "987654321",
    name: "Anna Sigurðardóttir",
    title: "Örorkuskírteini",
    subtitle: "75% örorka",
    photo: nil,
    uri: nil
  ))
}

#Preview(as: .systemMedium) {
  LicenseWidget()
} timeline: {
  LicenseEntry(date: .now, configuration: .driversLicense, licensePayload: LicensePayload(
    type: "DriversLicense",
    nationalId: "0101010000",
    licenseNumber: "123456789",
    licenseId: "987654321",
    name: "Jón Jónsson",
    title: "Ökuskírteini",
    subtitle: "B-flokkur",
    photo: nil,
    uri: nil
  ))
}

#Preview(as: .systemLarge) {
  LicenseWidget()
} timeline: {
  LicenseEntry(date: .now, configuration: .huntingLicense, licensePayload: LicensePayload(
    type: "HuntingLicense",
    nationalId: "0101010000",
    licenseNumber: "123456789",
    licenseId: "987654321",
    name: "Jón Jónsson",
    title: "Ökuskírteini",
    subtitle: "B-flokkur",
    photo: nil,
    uri: nil
  ))
}
