
exports.seed = function(knex, Promise) {
  return knex('buckets').del()
    .then(() => {
      return Promise.all([
        knex('buckets').insert({title: 'Track day', body: 'Race motorcycle on track all day'}, 'id')
        .then(() => console.log('Seeding Complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
