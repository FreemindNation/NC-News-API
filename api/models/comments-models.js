const db = require("../../db/connection");
const format = require("pg-format");

exports.selectCommentsByArticleId = (article_id, limit = 100, page = 1) => {
  const parsedLimit = parseInt(limit, 10);
  const parsedPage = parseInt(page, 10);

  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (isNaN(parsedPage) || parsedPage < 1) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const offset = (parsedPage - 1) * parsedLimit;

  return db
    .query(
      `
    SELECT *, COUNT(*) OVER() AS total_count FROM comments WHERE article_id = $1  ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [article_id, parsedLimit, offset]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentByArticleId = (newComment, article_id) => {
  const { body, username } = newComment;
  const votes = 0;
  const created_at = "NOW()";

  const formattedComment = [body, article_id, username, votes, created_at];

  const sqlQuery = format(
    `
    INSERT INTO comments (body, article_id, author, votes, created_at) VALUES %L
     RETURNING *`,
    [formattedComment]
  );

  return db.query(sqlQuery).then(({ rows }) => {
    return rows[0];
  });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments WHERE
     comment_id = $1 RETURNING *`,
      [comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
};

exports.updateCommentById = (comment_id, inc_votes) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows[0];
    });
};
