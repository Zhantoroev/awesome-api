const handleScore = (req, res, db) => {
  const { id, score } = req.body;
  db('users').where('id', '=', id)
  .update('entries', score)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleScore: handleScore
}