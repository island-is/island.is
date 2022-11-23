import { Rule, Scope } from 'eslint';
import * as estree from 'estree';
import Variable = Scope.Variable;
import CodePathSegment = Rule.CodePathSegment;
import Reference = Scope.Reference;
declare type LiteralValue = string;
declare class AssignedValues extends Set<LiteralValue> {
    type: 'AssignedValues';
}
interface UnknownValue {
    type: 'UnknownValue';
}
export declare const unknownValue: UnknownValue;
export declare type Values = AssignedValues | UnknownValue;
export declare function reachingDefinitions(reachingDefinitionsMap: Map<string, ReachingDefinitions>): void;
export declare class ReachingDefinitions {
    constructor(segment: Rule.CodePathSegment);
    segment: CodePathSegment;
    in: Map<Scope.Variable, Values>;
    out: Map<Scope.Variable, Values>;
    /**
     * collects references in order they are evaluated, set in JS maintains insertion order
     */
    references: Set<Scope.Reference>;
    add(ref: Reference): void;
    propagate(reachingDefinitionsMap: Map<string, ReachingDefinitions>): boolean;
    updateProgramState(ref: Reference, programState: Map<Variable, Values>): void;
    join(previousOut: Map<Variable, Values>): void;
}
export declare function resolveAssignedValues(lhsVariable: Variable, writeExpr: estree.Node | null, assignedValuesMap: Map<Variable, Values>, scope: Scope.Scope): Values;
export declare function getVariableFromIdentifier(identifier: estree.Identifier, scope: Scope.Scope): Scope.Variable | undefined;
export {};
