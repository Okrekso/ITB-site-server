const mysql = require("mysql");
// requiers

function query(query, callback = (result, error) => {}) {
    const con = require("./sql_definition").connect();
    var result;
    con.connect((err) => {
        if (err) {
            callback(undefined, `Error on connect: ${err}`);
            con.end();
            return;
        }
        if(query==undefined) {con.end(); return callback(undefined, `empty query`);}
        let res = con.query(query, (err, cb) => {
            
            if (err) {
                // con.end();
                callback(undefined, `Error on query: ${err}`);
                con.end();
                return;
            }
            con.end(() => {
                callback(cb,undefined);
                return;
            });
        });
    });
    return result;
}

module.exports.query = query;