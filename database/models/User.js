const { DataTypes } = require("sequelize");
const Sequelize = require("../connection");
const validator = require("validator");

const User = Sequelize.define(
    "User",
    {
        FerstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    arg: [true],
                    msg: "FerstName is require!"
                },
                notNull: {
                    msg: "FerstName is required!"
                },
                len: {
                    arg: [3, 30],
                    msg: "Length of name shold be betwen 3 and 30"
                }
            } 
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    arg: [true],
                    msg: "LastName is require!"
                },
                notNull: {
                    msg: "LastName is required!"
                },
                len: {
                    arg: [3, 30],
                    msg: "Length of LasntName shold be betwen 3 and 30"
                }
            }
        },
        UserName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
            validate: {
                notEmpty: {
                    arg: [true],
                    msg: "UserName is require!"
                },
                notNull: {
                    msg: "UserName is required!"
                },
                len: {
                    arg: [3, 30],
                    msg: "Length of UserName shold be betwen 3 and 30"
                }
            }
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    arg: [true],
                    msg: "Password is require!"
                },
                notNull: {
                    msg: "Password is required!"
                },
                len: {
                    arg: [4, 30],
                    msg: "Length of Password shold be betwen 4 and 30"
                }
            }
        },
        PhoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    arg: [true],
                    msg: "PhoneNumber is require!"
                },
                notNull: {
                    msg: "PhoneNumber is required!"
                },
                isphoneNumber(value) {
                    if(!validator.isMobilePhone(value, "fa-IR")) {
                        throw new Error("invalid Phone Number")
                    }

                }

            }

        },
        Gender: {
            type: DataTypes.ENUM("female", "male"),
            allowNull: false,
            defaultValue: "male",
            validate: {
                isIn: {
                  args: [['female', 'male']],
                  msg: "Gender must be either 'female' or 'male'",
                },
              },
        }
    },
);

module.exports = User