import { StaticText} from "@island.is/application/types";
import { coreHistoryMessages } from './messages';

export const getHistoryLogApprovedWithSubjectAndActor = (
  values: Record<string, unknown>
): StaticText => {
  const { subject, actor } = values as { subject: string; actor: string };
  //use fallback for older historylogs where nationalId info is missing
  if (!subject) return  coreHistoryMessages.applicationApprovedByReviewerFallback

  return subject === actor
    ? coreHistoryMessages.applicationApprovedByReviewer
    : coreHistoryMessages.applicationApprovedByReviewerWithActor;
};

