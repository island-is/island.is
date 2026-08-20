// qs arrayLimit for the server query parser, matched by dataloader batch sizes
// so a batch never sends more array items than the parser keeps as an array.
export const MAX_QUERY_PARAM_ARRAY_SIZE = 100
