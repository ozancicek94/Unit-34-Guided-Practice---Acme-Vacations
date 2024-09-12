//import modules

const {client, createTables, createUser, createPlace} = require('./db');

// create the init() function

const init = async() => {

  console.log("Connecting to the database");
  await client.connect();
  console.log("Conmected to the database");

  await createTables();
  console.log("Tables has been created");

  const [Ozan, Mariana, Celdy, Luis, Gui, Hasan, Serpil, Elif, Datca, Chalkidiki, Thessaloniki, Berlin, Amsterdam] = Promise.all([
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
  ])

}

// call the init function

init();