const db = require('../../db/connection')



exports.selectTopics = ()=> {
    return db.query('SELECT * FROM topics')
    .then(({ rows })=> {
        console.log(rows);
        if(!rows) {
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return rows;
    })
    
}

