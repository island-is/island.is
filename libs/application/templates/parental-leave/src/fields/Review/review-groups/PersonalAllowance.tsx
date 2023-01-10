import { DataValue, Label, RadioValue, ReviewGroup } from "@island.is/application/ui-components";
import { ReviewGroupProps } from "./props";
import { useLocale } from "@island.is/localization";
import { InputController, RadioController } from "@island.is/shared/form-fields";
import { useStatefulAnswers } from "../../../hooks/useStatefulAnswers";
import { NO, YES, YesOrNo, parentalLeaveFormMessages } from "../../..";
import { useFormContext } from "react-hook-form";
import { GridColumn, GridRow } from "@island.is/island-ui/core";

export const PersonalAllowance = ({
  application,
  editable,
  groupHasNoErrors,
  hasError
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale();
  const { setValue } = useFormContext();
  const [
    {
      usePersonalAllowance,
      personalUseAsMuchAsPossible,
      personalUsage,
    },
    setStateful,
  ] = useStatefulAnswers(application)

  return (
    <ReviewGroup
        isEditable={editable}
        canCloseEdit={groupHasNoErrors([
          'personalAllowance.usePersonalAllowance',
          'personalAllowance.useAsMuchAsPossible',
          'personalAllowance.usage',
        ])}
        editChildren={
          <>
            <Label marginBottom={4}>
              {formatMessage(parentalLeaveFormMessages.personalAllowance.title)}
            </Label>

            <RadioController
              id="personalAllowance.usePersonalAllowance"
              name="personalAllowance.usePersonalAllowance"
              defaultValue={usePersonalAllowance}
              split="1/2"
              options={[
                {
                  label: formatMessage(
                    parentalLeaveFormMessages.shared.yesOptionLabel,
                  ),
                  value: YES,
                },
                {
                  label: formatMessage(
                    parentalLeaveFormMessages.shared.noOptionLabel,
                  ),
                  value: NO,
                },
              ]}
              onSelect={(s: string) => {
                setStateful((prev) => ({
                  ...prev,
                  usePersonalAllowance: s as YesOrNo,
                }))
              }}
              error={hasError('personalAllowance.usePersonalAllowance')}
            />

            {usePersonalAllowance === YES && (
              <>
                <Label marginTop={2} marginBottom={2}>
                  {formatMessage(
                    parentalLeaveFormMessages.personalAllowance
                      .useAsMuchAsPossible,
                  )}
                </Label>

                <RadioController
                  id="personalAllowance.useAsMuchAsPossible"
                  name="personalAllowance.useAsMuchAsPossible"
                  defaultValue={personalUseAsMuchAsPossible}
                  split="1/2"
                  options={[
                    {
                      label: formatMessage(
                        parentalLeaveFormMessages.shared.yesOptionLabel,
                      ),
                      value: YES,
                    },
                    {
                      label: formatMessage(
                        parentalLeaveFormMessages.shared.noOptionLabel,
                      ),
                      value: NO,
                    },
                  ]}
                  onSelect={(s: string) => {
                    setStateful((prev) => ({
                      ...prev,
                      personalUseAsMuchAsPossible: s as YesOrNo,
                    }))
                    if (s === YES) setValue('personalAllowance.usage', '100')
                    if (s === NO) setValue('personalAllowance.usage', '')
                  }}
                  error={hasError('personalAllowance.useAsMuchAsPossible')}
                />
              </>
            )}

            {personalUseAsMuchAsPossible === NO &&
              usePersonalAllowance === YES && (
                <>
                  <Label marginTop={2} marginBottom={2}>
                    {formatMessage(
                      parentalLeaveFormMessages.personalAllowance.manual,
                    )}
                  </Label>

                  <InputController
                    id="personalAllowance.usage"
                    name="personalAllowance.usage"
                    suffix="%"
                    placeholder="0%"
                    type="number"
                    defaultValue={personalUsage}
                    onChange={(e) =>
                      setStateful((prev) => ({
                        ...prev,
                        personalUsage: e.target.value?.replace('%', ''),
                      }))
                    }
                    error={hasError('personalAllowance.usage')}
                  />
                </>
              )}
          </>
        }
        triggerValidation
      >
        <GridRow marginBottom={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                parentalLeaveFormMessages.personalAllowance.title,
              )}
              value={usePersonalAllowance}
            />
          </GridColumn>

          {usePersonalAllowance === YES && personalUseAsMuchAsPossible === YES && (
            <GridColumn
              paddingTop={[2, 2, 2, 0]}
              span={['12/12', '12/12', '12/12', '5/12']}
            >
              <RadioValue
                label={formatMessage(
                  parentalLeaveFormMessages.reviewScreen.usePersonalAllowance,
                )}
                value={personalUseAsMuchAsPossible}
              />
            </GridColumn>
          )}

          {usePersonalAllowance === YES && personalUseAsMuchAsPossible === NO && (
            <GridColumn
              paddingTop={[2, 2, 2, 0]}
              span={['12/12', '12/12', '12/12', '5/12']}
            >
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.personalAllowance.allowanceUsage,
                )}
                value={`${personalUsage ?? 0}%`}
              />
            </GridColumn>
          )}
        </GridRow>
      </ReviewGroup>
  )
};
