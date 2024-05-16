import { Answer, FormValue } from "@island.is/application/types"
import { AccidentTypeEnum, YesOrNo } from "../types";
import { getValueViaPath } from "@island.is/application/core";

// When a person is hurt in a sports accident and is an employee of the sport, the accident
// is considered a work accident. This function checks if both conditions have been checked
export const isSportAccidentAndEmployee = (formValue: FormValue) => {
  const workAccidentType = getValueViaPath(
    formValue,
    'accidentType.radioButton',
  ) as AccidentTypeEnum
  const onPayRoll = getValueViaPath(formValue, 'onPayRoll.answer') as YesOrNo;

  if (workAccidentType === AccidentTypeEnum.SPORTS && onPayRoll === 'yes') {
    return true;
  }

  return false
}