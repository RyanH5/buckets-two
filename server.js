const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'BucketList2';

app.get('/api/v1/items', (request, response) => {
  database('buckets').select()
    .then(items => {
      response.status(200).json(items)
    })
    .catch(error => {
      response.status(500).json({error})
    });
});

app.post('/api/v1/items', (request, response) => {
  const info = request.body;

  for (let requiredParameters of ['title', 'body']) {
    if (!info[requiredParameters]) {
      return response.status(422)
      .send({error: `Expected "${requiredParameters}"`})
    }
  }

  database('buckets').insert(info, 'id')
    .then(info => {
      response.status(201).json({id: info[0]})
    })
    .catch(error => {
      response.status(500).json({error})
    });
});

app.delete('/api/v1/items/', (request, response) => {
  const {id} = request.body;

  database('buckets').where({
    id: id
  }).del()
    .then(() => response.status(204).send(`you've successfully delted ${id} from the DB`))
    .catch((error) => {   
      response.status(500).json({ error })   
    })
})


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})