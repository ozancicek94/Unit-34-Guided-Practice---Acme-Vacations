//import modules

const {
  client, 
  createTables, 
  createUser, 
  createPlace, 
  createVacation,
  fetchUsers, 
  fetchPlaces, 
  fetchVacations, 
  destroyVacation
} = require('./db');

const express = require('express');
const app = express();

//parse the incoming requests from JSON

app.use(express.json());

//app routes here

app.get('/api/users', async(req, res, next) => {
  try{

    res.send (await fetchUsers());

  } catch (error) {next(error)}
});

app.get('/api/places', async(req,res,next) => {
  try{

    res.send(await fetchPlaces());

  } catch(error){next(error)}
});

app.get('/api/vacations', async(req,res,next) => {
  try{

    res.send(await fetchVacations());

  } catch(error) {next(error)}
});

app.delete('/api/users/:user_id/vacations/:id', async(req,res,next) => {
  try{
    await destroyVacation({user_id: req.params.user_id, id: req.params.id});

    res.sendStatus(204);

  } catch(error) {next(error)}
});

app.post('/api/users/:user_id/vacations', async(req,res,next) => {
  try{

    res.status(201).send(await createVacation({user_id: req.params.user_id, place_id: req.body.place_id, departure_date: req.body.departure_date}));

  } catch(error){(next(error))}
})



// create the init() function

const init = async() => {

  console.log("Connecting to the database");
  await client.connect();
  console.log("Connected to the database");

  await createTables();
  console.log("Tables has been created");

  const [Ozan, Mariana, Celdy, Luis, Gui, Hasan, Serpil, Elif, Datca, Chalkidiki, Thessaloniki, Berlin, Amsterdam] = await Promise.all([
    createUser({name: 'Ozan'}),
    createUser({name: 'Mariana'}),
    createUser({name: 'Celdy'}),
    createUser({name: 'Luis'}),
    createUser({name: 'Gui'}),
    createUser({name: 'Hasan'}),
    createUser({name: 'Serpil'}),
    createUser({name: 'Elif'}),

    createPlace({name: 'Datca'}),
    createPlace({name: 'Chalkidiki'}),
    createPlace({name: 'Thessaloniki'}),
    createPlace({name: 'Berlin'}),
    createPlace({name: 'Amsterdam'}),
  ]);

  console.log(await fetchUsers());
  console.log(await fetchPlaces());

  const [vacation, vacation2] = await Promise.all([
    createVacation({
      user_id: Ozan.id,
      place_id: Berlin.id,
      departure_date: '08/01/2025'
    }),

    createVacation({
      user_id: Mariana.id,
      place_id: Amsterdam.id,
      departure_date: '05/15/2026'
    }),
  ]);

  console.log(await fetchVacations());

  await destroyVacation({id: vacation.id, user_id: vacation.user_id});
  console.log(await fetchVacations());

  const port = process.env.PORT || 3000;

  app.listen(port, () =>{
    console.log(`listening on port ${port}`);
  })

}

// call the init function

init();