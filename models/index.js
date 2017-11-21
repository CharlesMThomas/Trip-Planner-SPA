const Sequelize = require ('sequelize');
const db = new Sequelize('postgres://localhost:5432/tripplanner', { logging: false });

const Place = db.define('place', {
    address: {
        type: Sequelize.STRING
    },
    city: {
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    location: {
        type: Sequelize.ARRAY (Sequelize.FLOAT)
    }
});

const Hotel = db.define('hotel', {
    name: {
        type: Sequelize.STRING
    },
    num_stars: {
        type: Sequelize.FLOAT,
        validate: {
            min: 1,
            max: 5
        }
    },
    amenities: {
        type: Sequelize.STRING
    }
});

const Activity = db.define('activity', {
    name: {
        type: Sequelize.STRING
    },
    age_range: {
        type: Sequelize.STRING
    }
});

const Restaurant = db.define('restaurant', {
    name: {
        type: Sequelize.STRING
    },
    cuisine: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.INTEGER,
        validate: {
            min: 1,
            max: 5
        }

    }
});

Hotel.belongsTo (Place);
Restaurant.belongsTo (Place);
Activity.belongsTo(Place);

module.exports = {db,
    Place,
    Hotel,
    Restaurant,
    Activity};
