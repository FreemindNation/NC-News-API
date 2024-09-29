const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertArticle,
  getTotalArticlesCount,
  removeArticleById,
} = require("../models/articles-models");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order, limit, page } = req.query;

  selectArticles(topic, sort_by, order, limit, page)
    .then((articles) => {
      const totalCount = parseInt(articles[0].total_count);
      const cleanedArticles = articles.map(
        ({ total_count, ...restOfKeys }) => restOfKeys
      );
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = parseInt(page, 10) || 1;
      const limitQuery = parseInt(limit, 10) || 100;

      res
        .status(200)
        .send({
          articles: cleanedArticles,
          total_count: totalCount,
          totalPages,
          currentPage,
          limit: limitQuery,
        });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_vote } = req.body;
  updateArticleById(article_id, inc_vote)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  insertArticle(newArticle)
    .then((newArticle) => {
      res.status(201).send({ newArticle });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
