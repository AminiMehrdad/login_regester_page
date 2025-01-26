const {v4: uuidv4} = require("uuid");
const Redis = require("ioredis");
const redis = new Redis();
const User = require("../database/models/User");
const { text } = require("express");

async function tokenCheker(req, res, next) {
    try {
        
        const token = req.cookies.token;
        if(!token) return res.redirect("/auth/login/")
        const targetUser = await redis.get(token);
        if (!targetUser) return res.redirect("/auth/login/")
        
        res.locals.user = JSON.parse(targetUser);
        next();
    } catch (error) {
        res.status(500).send({msg: "something went wrong"})
    }
    
};
async function tokenCheker2(req, res, next) {
    try {
        
        const token = req.cookies.token;
        if(!token) return next()
        const targetUser = await redis.get(token);
        if (!targetUser) return next()
        
        return res.redirect("/auth/dashbord");
    } catch (error) {
        res.status(500).send({msg: "something went wrong"})
    }
    
};

async function generateToken(user) {
    const token = uuidv4();
    await redis.set(token, JSON.stringify(user.dataValues));  
    await redis.expire(token, 30*60);
    return token
}

module.exports = {
    tokenCheker,
    generateToken,
    tokenCheker2
}