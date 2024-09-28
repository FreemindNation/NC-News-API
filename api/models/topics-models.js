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

    const sqlQuery = format(
        `INSERT INTO topics (slug, description) values %L RETURNING *`, [formattedTopic]
    )

    return db.query(sqlQuery)
    .then(({ rows })=> {
    
        return rows[0];
    })
}


