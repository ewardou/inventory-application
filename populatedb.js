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

async function consoleCreate(manufacturer, name, price, quantity, imageName) {
    const gameConsole = new Consoles({
        name,
        manufacturer,
        price,
        quantity,
        imageName,
    });
    await gameConsole.save();
    consoles.push(gameConsole);
    console.log(`Added console: ${name}`);
}

async function accessoryCreate(
    name,
    price,
    quantity,
    availableConsoles,
    imageName
) {
    const accessory = new Accessories({
        name,
        price,
        quantity,
        availableConsoles,
        imageName,
    });
    await accessory.save();
    accessories.push(accessory);
    console.log(`Added accesory: ${name}`);
}

async function gameCreate(
    name,
    price,
    quantity,
    synopsis,
    availableConsoles,
    imageName
) {
    const obj = {
        name,
        price,
        quantity,
        availableConsoles,
        imageName,
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
        consoleCreate(
            'Nintendo',
            'Nintendo Switch OLED',
            350,
            130,
            'switch.jpg'
        ),
        consoleCreate('Microsoft', 'Xbox Series X', 500, 42, 'xbox.jpg'),
        consoleCreate('Sony', 'Playstation 5', 500, 28, 'ps.jpg'),
    ]);
}

async function createAccessories() {
    console.log('Adding accessories');
    await Promise.all([
        accessoryCreate(
            '8Bitdo ultimate controller',
            70,
            12,
            consoles,
            '8bit.jpg'
        ),
        accessoryCreate(
            'Switch carrying case',
            16,
            24,
            [consoles[0]],
            'switch-case.jpg'
        ),
        accessoryCreate(
            'Screen protector',
            7,
            34,
            [consoles[0]],
            'screen-protector.jpg'
        ),
        accessoryCreate(
            'Pulse 3D headsets',
            100,
            7,
            [consoles[2]],
            'pulse.jpg'
        ),
        accessoryCreate(
            'Xbox elite controller',
            120,
            10,
            [consoles[1]],
            'elite-control.jpg'
        ),
    ]);
}

async function createGames() {
    console.log('Adding games');
    await Promise.all([
        gameCreate(
            'Forza Horizon 5',
            45,
            4,
            'Lead breathtaking expeditions across the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world’s greatest cars.',
            [consoles[1]],
            'forza.jpg'
        ),
        gameCreate(
            'Ghost of Tsushima',
            49,
            9,
            'Beyond war, ancient beauty endures: Roam vast countryside and expansive terrain to encounter rich characters, discover ancient landmarks and uncover the hidden beauty of Tsushima.',
            [consoles[2]],
            'ghost.jpg'
        ),
        gameCreate(
            'Persona 5 Royal',
            60,
            70,
            'Become the ultimate Phantom Thief and defy conventions, discover the power within, and fight for justice in the definitive version of Personal 5 Royal',
            consoles,
            'persona.jpg'
        ),
        gameCreate(
            'Megaman Battle Network',
            50,
            30,
            false,
            [consoles[0], consoles[2]],
            'megaman.jpg'
        ),
    ]);
}
