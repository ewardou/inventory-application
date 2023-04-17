// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require('mongoose');
const Games = require('./models/games');
const Consoles = require('./models/consoles');
const Accessories = require('./models/accessories');

const games = [];
const consoles = [];
const accessories = [];

mongoose.set('strictQuery', false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log('Debug: About to connect');
    await mongoose.connect(mongoDB);
    console.log('Debug: Should be connected?');
    await createConsoles();
    await createGames();
    await createAccessories();
    console.log('Debug: Closing mongoose');
    mongoose.connection.close();
}

async function consoleCreate(manufacturer, name, price, quantity) {
    const gameConsole = new Consoles({ name, manufacturer, price, quantity });
    await gameConsole.save();
    consoles.push(gameConsole);
    console.log(`Added console: ${name}`);
}

async function accessoryCreate(name, price, quantity, availableConsoles) {
    const accessory = new Accessories({
        name,
        price,
        quantity,
        availableConsoles,
    });
    await accessory.save();
    accessories.push(accessory);
    console.log(`Added accesory: ${name}`);
}

async function gameCreate(name, price, quantity, synopsis, availableConsoles) {
    const obj = {
        name,
        price,
        quantity,
        availableConsoles,
    };
    if (synopsis != false) obj.synopsis = synopsis;

    const game = new Games(obj);
    await game.save();
    games.push(game);
    console.log(`Added game: ${name}`);
}

async function createConsoles() {
    console.log('Adding consoles');
    await Promise.all([
        consoleCreate('Nintendo', 'Nintendo Switch OLED', 350, 130),
        consoleCreate('Microsoft', 'Xbox Series X', 500, 42),
        consoleCreate('Sony', 'Playstation 5', 500, 28),
    ]);
}

async function createAccessories() {
    console.log('Adding accessories');
    await Promise.all([
        accessoryCreate('8bit pro controller', 80, 12, consoles),
        accessoryCreate('Switch carrying case', 30, 8, [consoles[0]]),
        accessoryCreate('Screen protector', 15, 34, [consoles[0]]),
        accessoryCreate('Pulse 3d headsets', 100, 7, [consoles[2]]),
        accessoryCreate('Xbox elite controller', 120, 10, [consoles[1]]),
    ]);
}

async function createGames() {
    console.log('Adding games');
    await Promise.all([
        gameCreate('Forza horizon', 40, 4, 'Racing game', [consoles[1]]),
        gameCreate('Ghost of Tsushima', 45, 9, false, [consoles[2]]),
        gameCreate('Persona 5 Royal', 60, 70, 'Anime game', consoles),
        gameCreate('Megaman Network battle', 50, 30, false, [
            consoles[0],
            consoles[2],
        ]),
    ]);
}
