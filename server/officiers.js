"use strict";

const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('DemoDataBase.sqlite', (err) => {
    if (err) throw err;
});


exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Officiers WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) { resolve(false); }
            else {
                const user = { 
                    id: row.id, 
                    email: row.email, 
                    name: row.name, 
                    surname: row.surname, 
                    admin: row.admin, 
                    services: row.services 
                };

                const salt = row.salt;
                crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                    if (err) reject(err);

                    const passwordHex = Buffer.from(row.password, 'hex');

                    if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
                        resolve(false);
                    else resolve(user);
                });
            }
        });
    });
};

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM officiers WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                const user = { 
                    id: row.id, 
                    name: row.name, 
                    surname: row.surname, 
                    admin: row.admin, 
                    email: row.email, 
                    services: row.services 
                }
                resolve(user);
            }
        });
    });
};
