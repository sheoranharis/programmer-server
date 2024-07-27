module.exports = {
    MONGO_IP: process.env.MONGO_IP || 'mongo',
    MONGO_APP: process.env.MONGO_APP,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD, 
    SESSION_SECRET: process.env.SESSION_SECRET,
}