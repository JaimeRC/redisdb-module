const Redis = require('ioredis')

describe('RedisDB Testing', () => {

    global.OPTS_REDIS = {host: 'redis'}
    beforeEach(() => (new Redis(global.OPTS_REDIS)).flushall())

    require('./connection.test')

    require('./commands.test')

    require('./commands.hash.test')

    require('./commands.incr.decr.test')

    require('./commands.sets.test')

    require('./request.limit.test')

    require('./commands.lists.test')

    require('./commands.sorted.sets.test')

})
