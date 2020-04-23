const fs = require('fs')

module.exports = {
    css: {
        sourceMap: process.env.NODE_ENV === 'development'
    },

    devServer: {
        // https: {
        //     key: fs.readFileSync('./certs/example.com+5-key.pem'),
        //     cert: fs.readFileSync('./certs/example.com+5.pem'),
        // },
        // https: true,
        // public: 'https://localhost:8080/'
    }
}