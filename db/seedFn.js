const { sequelize } = require('./db');
const { User } = require('./');
const users = require('./seedData');
const bcrypt = require("bcrypt")

const seed = async () => {
  await sequelize.sync({ force: true }); // recreate db

  users.map(x => x.password = bcrypt.hash(x.password, 6))

  await Promise.all(users.map(x => x.password)).then((values) => {
    let count = 0
    for (let user in users) {
      users[user].password = values[count]
      count++
    }
  })

  await User.bulkCreate(users);

};

module.exports = seed;
