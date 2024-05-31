const db = require('../../db/connection');


exports.selectArticleById = (article_id)=> {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({ rows })=> {
      if(rows.length === 0){
        return Promise.reject({status: 404, msg: 'Article not found'})
      }
      return rows[0];
    })
  }

exports.selectArticles = (topic, sort_by= 'created_at', order= 'DESC')=> {
  
  const validsortQueries = [
    'title', 
    'topic', 
    'author', 
    'created_at', 
    'votes', 
    'comment_count'
  ];
  const validOrderQueries = [
    'ASC', 'DESC', 'asc', 'desc'
  ]

  if(!validsortQueries.includes(sort_by)){
    return Promise.reject({status: 400, msg: 'Bad request'})
  }

  if(!validOrderQueries.includes(order)){
    return Promise.reject({ status: 400, msg: 'Bad request'})
  }

  const queryValues = []
  const group = ' GROUP BY articles.article_id';

  let dbQuery = `
  SELECT articles.author,
  articles.title,
  articles.article_id,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comments.comment_id):: integer AS comment_count
  FROM articles LEFT JOIN comments ON 
  articles.article_id = comments.article_id`

  if(topic){
    dbQuery += ` WHERE topic = $1 ${group} ORDER BY ${sort_by} ${order}`;
    queryValues.push(topic);
  }
  else{
    dbQuery += ` ${group} ORDER BY ${sort_by} ${order}`;
   
  }


  return db.query(dbQuery, queryValues)
  .then(({ rows })=> {
    if(rows.length === 0) {
      return Promise.reject({status: 404, msg: 'Article not found'})
    }
    return rows;
  })

}

exports.checkArticleExist = (article_id) => {
  return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
  .then(({ rows })=> {
    if(rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Article not found' })
    }
  });
}

exports.updateArticleById = (article_id, inc_vote)=> {
  return db.query(`UPDATE articles SET votes = votes + $1
  WHERE article_id = $2 RETURNING *`, [inc_vote, article_id])
  .then(({ rows })=> {
    if(rows.length === 0){
      return Promise.reject({status: 404, msg: 'Article not found'})
    }
    return rows[0];
  })
}