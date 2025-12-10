//
//  AppIntent.swift
//  LicenseWidget
//
//  Created by Birkir Rafn Gudjonsson on 23.6.2025.
//

import WidgetKit
import AppIntents
import SwiftUI

struct ConfigurationAppIntent: WidgetConfigurationIntent {
  static var title: LocalizedStringResource { "Stillingar" }
  static var description: IntentDescription { "Flýtileið á skírteini" }

  @Parameter(title: "Skírteini", default: .driversLicense)
  var licenseType: LicenseType?

  @Parameter(title: "Sýna upplýsingar", default: true)
  var showInfo: Bool?

  init() {
    self.licenseType = .driversLicense
    self.showInfo = true
  }

  init(licenseType: LicenseType, showInfo: Bool = true) {
    self.licenseType = licenseType
    self.showInfo = showInfo
  }
}

enum LicenseType: String, AppEnum {
  case driversLicense,
       firearmLicense,
       huntingLicense,
       disabilityLicense,
       machineLicense,
       adrLicense;
  static var typeDisplayRepresentation: TypeDisplayRepresentation = "License Type"

  static var caseDisplayRepresentations: [LicenseType : DisplayRepresentation] = [
    .driversLicense: "Ökuskírteini",
    .firearmLicense: "Skotvopnaleyfi",
    .huntingLicense: "Veiðikort",
    .disabilityLicense: "Örorkuskírteini",
    .machineLicense: "Vinnuvélaskírteini",
    .adrLicense: "ADR skírteini",
    // .passport: "Vegabréf",
    // .ehic: "European Health Insurance Card",
    // .pcard: "Stæðiskort",
    // .identityDocument: "Nafnskírteini"
  ]
}

extension LicenseType {
    var backgroundColors: [Color] {
        switch self {
        case .driversLicense:
            return [Color(hex: "#F5E4EC"), Color(hex: "#E2C4D1")]
        case .firearmLicense:
            return [Color(hex: "#F1EDE2"), Color(hex: "#F5F4D5")]
        case .huntingLicense:
            return [Color(hex: "#DBEBF4"), Color(hex: "#B3D3E3")]
        case .disabilityLicense:
            return [Color(hex: "#DEE6D9"), Color(hex: "#8BAB8D")]
        case .machineLicense:
            return [Color(hex: "#E8FADD"), Color(hex: "#B3DC97")]
        case .adrLicense:
            return [Color(hex: "#F8FAF7"), Color(hex: "#EEFAE6")]
//        case .passport:
//            return [Color(hex: "#EAECF6"), Color(hex: "#ABB2D1")]
//        case .ehic:
//            return [Color(hex: "#EEF0F8"), Color(hex: "#95A0CF")]
//        case .identityDocument:
//            return [Color(hex: "#F0F0F0"), Color(hex: "#D0D0D0")]
//        case .pcard:
//            return [Color(hex: "#F0F0F0"), Color(hex: "#D0D0D0")]
        }
    }

    var iconName: String {
        switch self {
        case .driversLicense:
            return "AgencyCoatOfArms"
        case .firearmLicense:
            return "AgencyPolice"
        case .huntingLicense:
            return "AgencyPolice"
        case .disabilityLicense:
            return "AgencySocialInsurance"
        case .machineLicense:
            return "AgencyOccupationalSafetyHealth"
        case .adrLicense:
            return "AgencyOccupationalSafetyHealth"
//        case .passport:
//          return "AgencyRegisters"
//        case .ehic:
//          return "AgencyHealth"
//        case .identityDocument:
//            return "AgencyRegisters"
//        case .pcard:
//            return "AgencyCoatOfArms"
        }
    }

    var displayTitle: String {
        switch self {
        case .driversLicense:
            return "Ökuskírteini"
        case .firearmLicense:
            return "Skotvopnaleyfi"
        case .huntingLicense:
            return "Veiðikort"
        case .disabilityLicense:
            return "Örorkuskírteini"
        case .machineLicense:
            return "Vinnuvélaskírteini"
        case .adrLicense:
            return "ADR skírteini"
//        case .passport:
//            return "Vegabréf"
//        case .ehic:
//            return "Evrópska sjúkratryggingakortið"
//        case .identityDocument:
//            return "Nafnskírteini"
//        case .pcard:
//            return "Stæðiskort"
        }
    }

    var systemName: String {
      switch self {
      case .driversLicense:
        return "DriversLicense"
      case .firearmLicense:
        return "FirearmLicense"
      case .huntingLicense:
        return "HuntingLicense"
      case .disabilityLicense:
        return "DisabilityLicense"
      case .machineLicense:
        return "MachineLicense"
      case .adrLicense:
        return "AdrLicense"
//      case .ehic:
//        return "Ehic"
//      case .passport:
//        return "Passport"
//      case .identityDocument:
//        return "IdentityDocument"
//      case .pcard:
//        return "PCard"
      }
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (0, 0, 0, 0) // Fully transparent color
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
