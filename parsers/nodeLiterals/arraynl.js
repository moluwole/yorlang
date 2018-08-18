const BaseNodeLiteral = require("./basenl.js");
const constants = require("../../constants.js");

class ArrayNl extends BaseNodeLiteral {

    getNodeLiteral(arrayNameToken) {
        let node = {};
        node.operation = constants.ARRAY;

        if (arrayNameToken == undefined) { //it is an array literal e.g [1,2,3]
            node.body = this.parseDelimited( 
                constants.SYM.L_SQ_BRACKET , constants.SYM.R_SQ_BRACKET, constants.SYM.COMMA, 
                this.getTokenThatSatisfiesPredicate.bind(this), this.isNumStringVariable.bind(this)
            );
        } else { //it is an array element a[0]
            node.name = arrayNameToken.value;
            this.skipPunctuation(constants.SYM.L_SQ_BRACKET);
            node.index = this.lexer.next().value;
            this.skipPunctuation(constants.SYM.R_SQ_BRACKET);

            if (this.isOperator(constants.SYM.ASSIGN)) {
                this.skipOperator(constants.SYM.ASSIGN);
                node = {
                    left: node,
                    right: this.parseExpression(),
                    operation: constants.SYM.ASSIGN,
                    value: null                
                }; // a[0] = b = c = 2
            }
        }

        return node;
    }
}

module.exports = new ArrayNl();