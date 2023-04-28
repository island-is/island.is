import { getValueViaPath } from "@island.is/application/core";
import { Application, YesOrNo } from "@island.is/application/types";

export function getApplicationAnswers(answers: Application['answers']) {
  const pensionFundQuestion = getValueViaPath(answers, 'questions.pensionFund') as YesOrNo

  const abroadQuestion = getValueViaPath(answers, 'questions.abroad') as YesOrNo

  return {
    pensionFundQuestion, 
    abroadQuestion,
  }
}