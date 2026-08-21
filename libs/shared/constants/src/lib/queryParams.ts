// qs arrayLimit for the server query parser; dataloaders cap their batch size
// to the same value so a batch never sends more array items than qs keeps as
// an array (past it, qs turns the array into an object).
export const MAX_QUERY_PARAM_ARRAY_SIZE = 20
