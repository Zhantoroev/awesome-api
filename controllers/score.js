const handleScore = (req, res, db) => {
  const { id, score } = req.body;
  db('users').where('id', '=', id)
  .update({score})
  .then(() => {
    db
      .select('score')
      .from('users')
      .where({ id: id })
      .then(score => {
        console.log(score[0].score)
        res.json(score[0].score);
      })
  })
  .catch(err => res.status(400).json('unable to get score'))
}

module.exports = {
  handleScore: handleScore
}