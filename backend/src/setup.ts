


import mysql from 'mysql2/promise'
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USERDB,
    database:   process.env.DATABASE,
    password: process.env.PASSWORD,
    port:3306,
    // waitForConnections: true,
    // connectionLimit: 10,
    // maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    // idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    // queueLimit: 0,
    // enableKeepAlive: true,
    // keepAliveInitialDelay: 0
  });

export{
    db
}