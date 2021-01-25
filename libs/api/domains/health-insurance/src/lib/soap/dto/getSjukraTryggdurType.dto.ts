export interface getViewSjukraTryggdurDto{
    SjukratryggdurType: SjukratryggdurType
}

export interface SjukratryggdurType {
    radnumer_si: number,
    sjukratryggdur: number,
    dags?: Date,
    a_bidtima: number,
}