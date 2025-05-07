import { Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  OtherFeesPayeeOptions,
  RentalAmountPaymentDateOptions,
  RentalPaymentMethodOptions,
  SecurityDepositAmountOptions,
  SecurityDepositTypeOptions,
} from '../../../../../../../application/templates/rental-agreement/src/utils/enums'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { generateRentalAgreementEmail } from './rental-agreement-email'
import { applicationAnswers } from './utils'

@Injectable()
export class RentalAgreementService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.RENTAL_AGREEMENT)
  }

  async sendApplicationSummary({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateRentalAgreementEmail,
      application,
    )
    return
  }

  async submitApplicationToHmsRentalService({
    application,
  }: TemplateApiModuleActionProps) {
    const { id, applicant, answers } = application
    const {
      landlords,
      tenants,
      searchResults,
      categoryType,
      categoryClass,
      units,
      description,
      rules,
      conditionDescription,
      inspector,
      inspectorName,
      files,
      fireBlankets,
      smokeDetectors,
      fireExtinguisher,
      emergencyExits,
      startDate,
      endDate,
      rentalAmount,
      isIndexConnected,
      indexType,
      indexRate,
      paymentMethod,
      paymentMethodOther,
      paymentDay,
      paymentDayOther,
      bankAccountNumber,
      nationalIdOfAccountOwner,
      securityDepositType,
      bankGuaranteeInfo,
      thirdPartyGuaranteeInfo,
      insuranceCompanyInfo,
      landlordsMutualFundInfo,
      otherInfo,
      securityDepositAmount,
      securityDepositAmountOther,
      housingFundPayee,
      housingFundAmount,
      electricityCostPayee,
      electricityCostMeterNumber,
      electricityCostMeterStatus,
      electricityCostMeterStatusDate,
      heatingCostPayee,
      heatingCostMeterNumber,
      heatingCostMeterStatus,
      heatingCostMeterStatusDate,
      otherCostItems,
    } = applicationAnswers(answers)

    const landlordsArray = landlords?.map((landlord) => {
      return {
        NationalId: landlord.nationalIdWithName.nationalId, // Required
        Name: landlord.nationalIdWithName.name, // Required
        Email: landlord.email, // Required
        Phone: landlord.phone, // Required
        Address: landlord.address, // Required
        IsRepresentative: Boolean(
          landlord.isRepresentative.includes('isRepresentative'),
        ),
      }
    })

    const tenantsArray = tenants?.map((tenant) => {
      return {
        NationalId: tenant.nationalIdWithName.nationalId, // Required
        Name: tenant.nationalIdWithName.name, // Required
        Email: tenant.email, // Required
        Phone: tenant.phone, // Required
        Address: tenant.address, // Required
        IsRepresentative: Boolean(
          tenant.isRepresentative.includes('isRepresentative'),
        ),
      }
    })

    if (!searchResults) {
      throw new Error('Property info is not defined')
    }

    if (!units) {
      throw new Error('Property units are not defined')
    }

    const appraisalUnits = units?.map((unit) => {
      const propertySize =
        unit.changedSize && unit.changedSize >= 3 ? unit.changedSize : unit.size
      const apartmentFloor =
        unit.unitCode && parseInt(unit.unitCode.substring(2, 4), 10).toString()
      const apartmentNumber =
        unit.unitCode && parseInt(unit.unitCode.slice(-2), 10).toString()

      return {
        AppraisalUnitId: unit.unitCode, // Required
        Floor: apartmentFloor,
        ApartmentNumber: apartmentNumber,
        Size: propertySize, // Required
        Rooms: unit.numOfRooms, // Required
      }
    })

    const otherFeesOtherCostItems = otherCostItems?.map((item) => {
      return {
        Name: item.description,
        Amount: item.amount,
      }
    })

    const getSecurityDepositTypeDescription = (type: string) => {
      if (type === 'Capital' || type === 'None' || type === '') {
        return ''
      }

      switch (type) {
        case 'BankGuarantee':
          return bankGuaranteeInfo
        case 'ThirdPartyGuarantee':
          return thirdPartyGuaranteeInfo
        case 'InsuranceCompany':
          return insuranceCompanyInfo
        case 'LandlordMutualFund':
          return landlordsMutualFundInfo
        case 'Other':
          return otherInfo
        default:
          return ''
      }
    }

    const propertyId = units && units.length > 0 ? units[0].propertyCode : ''

    // TODO: Check if mapping is correct, are types corresponding to the API?
    const newApplication = {
      ApplicationId: id, // Required
      InitiatorNationalId: applicant, // Required
      Landlords: landlordsArray, // Required
      Tenants: tenantsArray, // Required
      Property: {
        Address: searchResults?.address || new Error('Address is required'), // Required
        Municipality: searchResults?.municipalityName || '', // Required
        Zip: searchResults?.postalCode?.toString() || '', // Required
        PropertyId: propertyId, // Required
        AppraisalUnits: appraisalUnits || [], // Required
        Part: 'Whole', // Required // Whole | Part // TODO: Should this be added or do we make an assumption. We do not ask about this in the application.
        Type: categoryType || '', // Required
        SpecialGroup: categoryClass || 'No', // Required
      },
      Lease: {
        // TODO: Description, Rules and Condition are required in the API but not in the application
        Description: description, // Required
        Rules: rules, // Required
        Condition: conditionDescription || 'See files for info', // Required // TODO: Check if this is correct?
        InspectorType: inspector,
        IndipendantInspector: inspectorName,
        HasInspectionFiles: files && files.length > 0 ? true : false, // Required
        FireProtections: {
          FireBlanket: fireBlankets || 0,
          EmergencyExits: emergencyExits || 0, // Required
          SmokeDetectors: smokeDetectors || 0, // Required
          FireExtinguisher: fireExtinguisher || 0, // Required
        },
        StartDate: startDate || '', // Required
        EndDate: endDate || '',
        IsDefinite: endDate ? true : false, // Required // TODO: Check... This is not mentioned in the JSON format documentation, but saw it in the structure
        Rent: {
          Amount: rentalAmount || 0, // Required
          Index: isIndexConnected ? indexType : 'None', // Required // TODO: Update.... Right now there is a choice of three index types but should only be: None | ConsumerPriceIndex
          IndexRate: indexRate || null,
        },
        Payment: {
          Method: paymentMethod, // Required
          OtherMethod:
            paymentMethod === RentalPaymentMethodOptions.OTHER
              ? paymentMethodOther
              : null,
          PaymentDay: paymentDay, // Required
          OtherPaymentDay:
            paymentDay === RentalAmountPaymentDateOptions.OTHER
              ? paymentDayOther
              : null,
          BankAccountNumber:
            paymentMethod === RentalPaymentMethodOptions.BANK_TRANSFER
              ? bankAccountNumber
              : null,
          NationalIdOfAccountOwner:
            paymentMethod === RentalPaymentMethodOptions.BANK_TRANSFER
              ? nationalIdOfAccountOwner
              : null,
        },
        SecurityDeposit: {
          Type: securityDepositType || 'None',
          OtherType:
            securityDepositType === SecurityDepositTypeOptions.OTHER
              ? otherInfo
              : null,
          Description: securityDepositType
            ? getSecurityDepositTypeDescription(securityDepositType)
            : null,
          Amount: securityDepositAmount,
          OtherAmount:
            securityDepositAmount === SecurityDepositAmountOptions.OTHER
              ? securityDepositAmountOther
              : 0,
        },
        OtherFees: {
          HousingFund: {
            PayedBy:
              housingFundPayee === OtherFeesPayeeOptions.TENANT
                ? 'Tenant'
                : 'Landlord',
            Amount: housingFundAmount || 0,
          },
          ElectricityCost: {
            PayedBy:
              electricityCostPayee === OtherFeesPayeeOptions.TENANT
                ? 'Tenant'
                : 'Landlord',
            MeterNumber: electricityCostMeterNumber || '',
            MeterStatus: electricityCostMeterStatus || '',
            MeterStatusDate: electricityCostMeterStatusDate || '',
          },
          HeatingCost: {
            PayedBy:
              heatingCostPayee === OtherFeesPayeeOptions.TENANT
                ? 'Tenant'
                : 'Landlord',
            MeterNumber: heatingCostMeterNumber || '',
            MeterStatus: heatingCostMeterStatus || '',
            MeterStatusDate: heatingCostMeterStatusDate || '',
          },
          MiscellaneousFees: otherFeesOtherCostItems,
        },
      },
    }

    console.log(
      '-------------------- Answers sent to RentalService --------------------: ',
      newApplication,
    )
  }
}
