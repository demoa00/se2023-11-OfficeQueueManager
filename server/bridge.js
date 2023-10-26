"use strict";

const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('DemoDataBase.sqlite', (err) => {
    if (err) throw err;
});


exports.GetNumberOfServicePerOfficer = (id) => {
    return new Promise((resolve, reject) => {
        const sql ='SELECT officer_id, COUNT() as numservices FROM Bridge WHERE officer_id IN (SELECT officer_id FROM Bridge WHERE service_id = ?) GROUP BY officer_id';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const numservices = rows.map((e) => ({
                id: e.officer_id,
                numservices: e.numservices
            }
            ));
            resolve(numservices);
        });
    });
}