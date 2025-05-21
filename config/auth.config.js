module.exports = {
    secret: procces.env.JWT_SECRET || "tusecretoparalostokens", 
    jwtExpriation: 86400, 
    jwtRefresh: 604800,
};