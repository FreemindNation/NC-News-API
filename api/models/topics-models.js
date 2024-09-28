const db = require('../../db/connection')
const format = require('pg-format')



exports.selectTopics = ()=> {
    return db.query('SELECT * FROM topics')
    .then(({ rows })=> {

        return rows;
    });
}

exports.insertTopic = (slug, description)=> {

    const formattedTopic = [slug, description];

    if(!slug || !description) {
        return Promise.reject({ status: 400, msg: 'Bad request' })
    }

    if(!isNaN(parseInt(slug)) || !isNaN(parseInt(description))){
        return Promise.reject({ status: 400, msg: 'Bad request' })
    }

    const sqlQuery = format(
        `INSERT INTO topics (slug, description) values %L RETURNING *`, [formattedTopic]
    )

    return db.query(sqlQuery)
    .then(({ rows })=> {
    console.log(rows);
        return rows[0];
    })
}


