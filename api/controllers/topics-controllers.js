const { selectTopics, insertTopic } = require('../models/topics-models');

exports.getTopics = (req, res, next)=> {
    selectTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch(next);
}

exports.postTopic = (req, res, next)=> {
    const { slug, description } = req.body;
    console.log(req.body);
    insertTopic(slug, description)
    .then((newTopic)=> {
        res.status(201).send({ newTopic })
    })
    .catch(next)
}