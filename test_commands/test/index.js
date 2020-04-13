const Redis = require('ioredis')

describe('RedisDB Testing', () => {

    global.OPTS_REDIS = {host: 'redis'}
    beforeEach(() => (new Redis(global.OPTS_REDIS)).flushall())

   // require('./connection.test')

   // require('./commands.test')

  //  require('./command.hash.test')

   // require('./commands.incr.decr.test')

    //require('./commands.sets.test')

    require('./petitions.limit.test')

})
