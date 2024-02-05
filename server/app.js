const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors())
app.use(express.json());

const mongoURI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/studio';
mongoose.connect(mongoURI);

const stressSchema = new mongoose.Schema({
    word: String,
    stress: Array,
})

const Stress = mongoose.model('Stress', stressSchema)

async function getWords() {
    return Stress.find();
}

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.get('/get-test', async (req, res) => {
    const letter = req.query.letter || '';
    const count = req.query.count || 20;
    console.log(letter, count)
    try {
        const words = await Stress.aggregate([
            { $match: { word: { $regex: `^${letter}`, $options: 'i' } } },
            { $sample: { size: Number(count) } },
            { $project: { 'word': 1 } }
        ])
        const response = {};
        words.forEach((el) => {
            response[el._id] = { word: el.word }
        })
        res.json(response);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

app.post('/check-test', async(req, res) => {
    const answers = req.body.words;
    const ids = Object.keys(answers);
    console.log(answers)
    try {
        if (!req.body.words) {
            res.status(403).json({status: 'No words'})
        }
        const stresses = await Stress.find({ _id: { $in: ids } })
        const response = {}
        for (const id in answers) {
            const stressData = stresses.find((word) => word._id.toString() === id);
            if (stressData && !answers[id].stress.every((el) => stressData.stress.includes(el))) {
                response[id] = stressData;
            }
        }
        res.json(response)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

app.post('/save-word', async (req, res) => {
    try {
        if (!req.body.word) {
            res.status(403).json({status: 'No word'})
        }
        const word = new Stress({ word: req.body.word, stress: req.body.stress })
        await word.save();
        const words = await getWords()
        res.json({status: 'success', words})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.delete('/delete-word', async (req, res) => {
    const id = req.body.wordId;
    try {
        const deletedWord = await Stress.deleteOne({_id: id});
        const words = await getWords()
        if (!deletedWord) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully', deletedWord, words});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Маршрут для получения всех заметок
app.get('/words', async (req, res) => {
    try {
        const words = await getWords();
        res.json(words);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(process.env.PORT || PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);
