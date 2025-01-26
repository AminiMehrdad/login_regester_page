const {ValidationErrorItem} =require("sequelize");


function erorrHandler(response, error) {
    if (
        error.errors instanceof Array &&
        error.errors[0] instanceof ValidationErrorItem
    ) {
        return response.status(400).send({
            errors: error.errors.map(function(el){
                return el.message
            }),
        });
    }
    response.status(500).send({massage: "internal server error"});
}

module.exports = erorrHandler