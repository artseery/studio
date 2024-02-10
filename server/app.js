const express = require('express');
const cors = require('cors');
const redis = require('redis')

const app = express();
const PORT = 3000;

app.use(cors())
app.use(express.json());

const client = redis.createClient({
    url: 'redis://red-cn33rstjm4es73bi5lo0:6379',
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

const prefix = 'stresses';

// Middleware для использования Redis
app.use((req, res, next) => {
    req.redisClient = client;
    next();
});

// Функция для получения случайного индекса
function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

// Получение 10 случайных элементов
function getRandomElements(array, count) {
    let result = [];
    const length = array.length;

    // Если запрашиваемое количество элементов больше, чем длина массива, уменьшите count
    count = Math.min(count, length);

    while (result.length < count) {
        const randomIndex = getRandomIndex(length);
        const randomElement = array[randomIndex];

        // Убедитесь, что элемент не был выбран ранее
        if (!result.includes(randomElement)) {
            result.push(randomElement);
        }
    }

    return result;
}

async function getWords() {
    return await client.hGetAll(prefix)
}

app.get('/', async (req, res)=>{
    const result = await client.hScan(prefix, 0, {COUNT: 1})
    res.status(200);
    res.send(result);
});

app.get('/get-test', async (req, res) => {
    const letter = req.query.letter || '';
    const count = req.query.count || 20;
    try {
        const scan = await client.hScan(prefix, 0, {MATCH: `${letter}*`})
        const tuples = scan.tuples
        const response = getRandomElements(tuples, count).map((el) => el.field)
        res.json(response);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

app.post('/check-test', async(req, res) => {
    const answers = req.body.words;
    // привет: [2]
    try {
        if (!req?.body?.words || Object.keys(answers).length === 0) {
            res.status(403).json({status: 'No words'})
            return;
        }
        const words = Object.keys(answers);
        const stresses = await client.hmGet(prefix, words)
        const rightAnswers = {}
        stresses.forEach((el, index) => {
            rightAnswers[`${words[index]}`] = el
        })
        const response = {}
        const wrongWords = words.filter((word, index) => !answers[word].every((el) => JSON.parse(stresses[index]).includes(el)))
        wrongWords.forEach((el) => {
            response[el] = rightAnswers[el]
        })
        res.json({mistakes: response})
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

app.post('/save-word', async (req, res) => {
    try {
        if (!req.body.word) {
            res.status(403).json({status: 'No word'})
            return;
        }
        const { word, stress } = req.body;
        // Добавляем запись с префиксом в Redis
        await client.hSet(prefix, word.toLowerCase(), JSON.stringify(stress));
        const words = await getWords()
        res.json({ message: 'New word added', words })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.delete('/delete-word', async (req, res) => {
    const word = req.body.word;
    try {
        await client.hDel(prefix, word)
        const words = await getWords()
        res.json({ message: 'Note deleted successfully', words});
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
