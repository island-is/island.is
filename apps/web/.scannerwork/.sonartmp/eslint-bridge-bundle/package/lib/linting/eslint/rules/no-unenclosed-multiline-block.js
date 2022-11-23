"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2022 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
// https://sonarsource.github.io/rspec/#/rspec/S2681/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const NestingStatementLike = [
    'IfStatement',
    'ForStatement',
    'ForInStatement',
    'ForOfStatement',
    'WhileStatement',
];
exports.rule = {
    create(context) {
        return {
            Program: (node) => checkStatements(node.body, context),
            BlockStatement: (node) => checkStatements(node.body, context),
            TSModuleBlock: (node) => checkStatements(node.body, context),
        };
    },
};
function checkStatements(statements, context) {
    chain(statements)
        .filter(chainedStatements => chainedStatements.areUnenclosed())
        .forEach(unenclosedConsecutives => {
        if (unenclosedConsecutives.areAdjacent()) {
            raiseAdjacenceIssue(unenclosedConsecutives, context);
        }
        else if (unenclosedConsecutives.areBothIndented()) {
            raiseBlockIssue(unenclosedConsecutives, countStatementsInTheSamePile(unenclosedConsecutives.prev, statements), context);
        }
        else if (unenclosedConsecutives.areInlinedAndIndented()) {
            raiseInlineAndIndentedIssue(unenclosedConsecutives, context);
        }
    });
}
function chain(statements) {
    return statements
        .reduce((result, statement, i, array) => {
        if (i < array.length - 1 && isNestingStatement(statement)) {
            result.push({ prev: statement, next: array[i + 1] });
        }
        return result;
    }, new Array())
        .map(pair => {
        return new ChainedStatements(pair.prev, extractLastBody(pair.prev), pair.next);
    });
}
function extractLastBody(statement) {
    if (statement.type === 'IfStatement') {
        if (statement.alternate) {
            return statement.alternate;
        }
        else {
            return statement.consequent;
        }
    }
    else {
        return statement.body;
    }
}
function countStatementsInTheSamePile(reference, statements) {
    const startOfPile = position(reference).start;
    let lastLineOfPile = startOfPile.line;
    for (const statement of statements) {
        const currentPosition = position(statement);
        const currentLine = currentPosition.end.line;
        const currentIndentation = currentPosition.start.column;
        if (currentLine > startOfPile.line) {
            if (currentIndentation === startOfPile.column) {
                lastLineOfPile = currentPosition.end.line;
            }
            else {
                break;
            }
        }
    }
    return lastLineOfPile - startOfPile.line + 1;
}
function raiseAdjacenceIssue(adjacentStatements, context) {
    context.report({
        message: `This statement will not be executed ${adjacentStatements.includedStatementQualifier()}; only the first statement will be. ` +
            `The rest will execute ${adjacentStatements.excludedStatementsQualifier()}.`,
        node: adjacentStatements.next,
    });
}
function raiseBlockIssue(piledStatements, sizeOfPile, context) {
    context.report({
        message: `This line will not be executed ${piledStatements.includedStatementQualifier()}; only the first line of this ${sizeOfPile}-line block will be. ` +
            `The rest will execute ${piledStatements.excludedStatementsQualifier()}.`,
        node: piledStatements.next,
    });
}
function raiseInlineAndIndentedIssue(chainedStatements, context) {
    context.report({
        message: `This line will not be executed ${chainedStatements.includedStatementQualifier()}; only the first statement will be. ` +
            `The rest will execute ${chainedStatements.excludedStatementsQualifier()}.`,
        node: chainedStatements.next,
    });
}
function isNestingStatement(node) {
    return NestingStatementLike.includes(node.type);
}
class ChainedStatements {
    constructor(topStatement, prev, next) {
        this.topStatement = topStatement;
        this.prev = prev;
        this.next = next;
        const topPosition = position(topStatement);
        const prevPosition = position(prev);
        const nextPosition = position(next);
        this.positions = {
            prevTopStart: topPosition.start,
            prevTopEnd: topPosition.end,
            prevStart: prevPosition.start,
            prevEnd: prevPosition.end,
            nextStart: nextPosition.start,
            nextEnd: nextPosition.end,
        };
    }
    areUnenclosed() {
        return this.prev.type !== 'BlockStatement';
    }
    areAdjacent() {
        return this.positions.prevEnd.line === this.positions.nextStart.line;
    }
    areBothIndented() {
        return (this.positions.prevStart.column === this.positions.nextStart.column && this.prevIsIndented());
    }
    areInlinedAndIndented() {
        return (this.positions.prevStart.line === this.positions.prevTopEnd.line &&
            this.positions.nextStart.column > this.positions.prevTopStart.column);
    }
    includedStatementQualifier() {
        return this.topStatement.type === 'IfStatement' ? 'conditionally' : 'in a loop';
    }
    excludedStatementsQualifier() {
        return this.topStatement.type === 'IfStatement' ? 'unconditionally' : 'only once';
    }
    prevIsIndented() {
        return this.positions.prevStart.column > this.positions.prevTopStart.column;
    }
}
function position(node) {
    return node.loc;
}
//# sourceMappingURL=no-unenclosed-multiline-block.js.map