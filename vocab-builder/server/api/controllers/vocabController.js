const mongoose = require('mongoose');
const Vocab = mongoose.model('Vocab');

exports.list_all_words = (req, res) => {
  Vocab.find({}, (err, words) => {
    if (err) res.send(err);
    res.json(words);
  });
};

exports.create_a_word = async (req, res) => {
  try {
    const existingWord = await Vocab.findOne({
      $or: [
        { english: req.body.english },
        { german: req.body.german },
        { french: req.body.french }
      ]
    });

    if (existingWord) {
      return res.status(400).json({ message: 'Word already exists' });
    }

    const newWord = new Vocab(req.body);
    const savedWord = await newWord.save();
    res.json(savedWord);

  } catch (err) {
    res.status(500).send(err);
  }
};

exports.read_a_word = (req, res) => {
  Vocab.findById(req.params.wordId, (err, word) => {
    if (err) res.send(err);
    res.json(word);
  });
};

exports.update_a_word = (req, res) => {
  Vocab.findOneAndUpdate(
    { _id: req.params.wordId },
    req.body,
    { new: true },
    (err, word) => {
      if (err) res.send(err);
      res.json(word);
    }
  );
};
  
exports.delete_a_word = (req, res) => {
  Vocab.deleteOne({ _id: req.params.wordId }, err => {
    if (err) res.send(err);
    res.json({
      message: 'Word successfully deleted',
      _id: req.params.wordId
    });
  });
};
  
exports.search_words = (req, res) => {
  const searchTerm = req.query.q;
  const regex = new RegExp(searchTerm); 
  Vocab.find({
    $or: [
      { english: regex },
      { german: regex },
      { french: regex }
    ]
  }, (err, words) => {
    if (err) res.send(err);
    res.json(words);
  });
};

