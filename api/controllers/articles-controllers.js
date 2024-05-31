const { selectArticleById, selectArticles, updateArticleById } = require("../models/articles-models")



exports.getArticlesById = (req, res, next)=> {
    const { article_id } = req.params;
    selectArticleById(article_id)
    .then((article)=> { 
        res.status(200).send({ article });
    })
    .catch(next);
}

exports.getArticles = (req, res, next)=> {
    const { topic } = req.query;
    selectArticles(topic)
    .then((articles)=> {
    res.status(200).send({ articles });
    })
    .catch(next);
}

exports.patchArticleById = (req, res, next)=> {
    const { article_id } = req.params;
    const { inc_vote } = req.body;
    
    updateArticleById(article_id, inc_vote)
    .then((updatedArticle)=> {
        
        res.status(200).send({ updatedArticle })
    })
    .catch(next)
}