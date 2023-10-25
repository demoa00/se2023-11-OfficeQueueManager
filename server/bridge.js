"use strict";

const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('DemoDataBase.sqlite', (err) => {
    if (err) throw err;
});


exports.GetNumberOfServicePerOfficier = (id) => {
    return new Promise((resolve, reject) => {
        const sql ='SELECT officier_id, COUNT() as numservices FROM Bridge WHERE officier_id IN (SELECT officier_id FROM Bridge WHERE service_id = ?) GROUP BY officier_id';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const numservices = rows.map((e) => ({
                id: e.officier_id,
                numservices: e.numservices
            }
            ));
            resolve(numservices);
        });
    });
}