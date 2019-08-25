module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    URL: process.env.BASE_URL || 'http://localhost:3000',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://standadmin:stand007@ds253857.mlab.com:53857/stand_db',
    JWT_SECRET: process.env.JWT_SECRET || 'uehriuw47w7nriwhekur8'
}