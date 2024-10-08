const db = require("../../db/connection");
const format = require("pg-format");

exports.selectArticles = (
  topic,
  sort_by = "created_at",
  order = "DESC",
  limit = 100,
  page = 1
) => {
  const validsortQueries = [
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrderQueries = ["ASC", "DESC", "asc", "desc"];

  const parsedLimit = parseInt(limit, 10);
  const parsedPage = parseInt(page, 10);

  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (isNaN(parsedPage) || parsedPage < 1) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const currentPage = parsedPage;
  const limitQuery = parsedLimit;
  const offset = (currentPage - 1) * limitQuery;

  if (sort_by && !validsortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (order && !validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const queryValues = [];
  const selectColumns = `
  articles.author,
  articles.title,
  articles.article_id,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comments.comment_id):: integer AS comment_count`;

  const groupByColumns = `
  articles.article_id
  `;

  let dbQuery = `
  SELECT ${selectColumns}, COUNT(*) OVER() AS total_count
  FROM articles LEFT JOIN comments ON 
  articles.article_id = comments.article_id`;

  if (topic) {
    dbQuery += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  dbQuery += ` GROUP BY ${groupByColumns} ORDER BY ${sort_by} ${order} LIMIT ${limitQuery} OFFSET ${offset}`;

  return db.query(dbQuery, queryValues).then(({ rows }) => {
    const totalCount = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
    const totalPages = Math.ceil(totalCount / limitQuery);

    if (rows.length === 0 && typeof topic === "string") {
      return Promise.reject({ status: 404, msg: "Articles not found" });
    }

    if (rows.length === 0 && currentPage > totalPages) {
      return Promise.reject({ status: 404, msg: "Page not found" });
    }

    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Articles not found" });
    }
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id)::integer AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
   GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

exports.checkArticleExist = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};

exports.updateArticleById = (article_id, inc_vote) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1
  WHERE article_id = $2 RETURNING *`,
      [inc_vote, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

exports.insertArticle = (newArticle) => {
  const { author, title, body, topic, article_img_url } = newArticle;

  const formattedArticle = [author, title, body, topic, article_img_url];

  const sqlQuery = format(
    `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES %L RETURNING *`,
    [formattedArticle]
  );

  return db.query(sqlQuery).then(({ rows }) => {
    const newArticle = rows[0];
    newArticle.comment_count = 0;
    return newArticle;
  });
};

exports.removeArticleById = (article_id) => {
  return db
    .query(`DELETE FROM comments WHERE article_id = $1`, [article_id])
    .then(() => {
      return db.query(
        `DELETE FROM articles WHERE article_id = $1 RETURNING *`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    });
};
