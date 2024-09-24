const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertArticle,
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
  const { topic, sort_by, order } = req.query;
  selectArticles(topic, sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
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
