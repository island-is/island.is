import stylelint from 'stylelint';
/**
 * The set of internal Stylelint-based rules
 */
declare const rules: {
    [key: string]: stylelint.Rule<any, any>;
};
export { rules };
