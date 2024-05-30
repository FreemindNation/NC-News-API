
const { checkArticleExist } = require("../models/articles-models");
const { selectCommentsByArticleId, insertCommentByArticleId } = require("../models/comments-models")



exports.getCommentsByArticleId = (req, res, next)=> {
        const { article_id } = req.params;

    const promises = [selectCommentsByArticleId(article_id)]

    if(article_id) {
        promises.push(checkArticleExist(article_id));
    }

    Promise.all(promises)
    .then((resolvedPromises)=> {
        const comments = resolvedPromises[0];
        res.status(200). send({ comments });
    })
    .catch(next);
}

exports.postCommentByArticleId = (req, res, next)=> {
    const   newComment  = req.body;
    const  { article_id } = req.params;
    

    const promises = [insertCommentByArticleId(newComment, article_id)];

    if(article_id){
        promises.push(checkArticleExist(article_id))
    }
    Promise.all(promises)
    .then((resolvedPromises)=> {
    
        const newComment  = resolvedPromises[0];
        res.status(201).send({ newComment })
    })
    .catch(next);
}