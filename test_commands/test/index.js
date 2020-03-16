describe('RedisDB Testing', () => {

    global.OPTS_REDIS = {host: 'redis'}

   // require('./connection.test')

    //require('./commands.test')

    require('./command.hash.test')

})
