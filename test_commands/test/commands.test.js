const Redis = require('ioredis')
const {expect} = require('chai')

describe('Various Commands', function () {

    let redis
    before(()=> redis = new Redis(global.OPTS_REDIS))

    it('should support callback', function (done) {
        redis.set('name', 'Peter')
        redis.get('name', function (err, result) {
            expect(result).to.eql('Peter')
            done()
        })
    })

    it('should support promise', function (done) {
        redis.set('name', 'Peter')
        redis.get('name')
            .then((result) => expect(result).to.eql('Peter'))
            .finally(done)
    })

    it('should keep the response order when mix using callback & promise', function (done) {
        let order = 0
        redis.get('test')
            .then(() => expect(++order).to.eql(1))

        redis.get('test', function () {
            expect(++order).to.eql(2)
        })
        redis.get('test')
            .then(() => expect(++order).to.eql(3))

        redis.get('test', function () {
            expect(++order).to.eql(4)
            done()
        })
    })

    it('should support get & set buffer', async () => {
        const res = await redis.set(Buffer.from('name'), Buffer.from('Peter'))

        expect(res).to.eql('OK')

        const result = await redis.getBuffer(Buffer.from('name'))

        expect(result).to.be.instanceof(Buffer)
        expect(result.toString()).to.eql('Peter')
    })

    it('should support get & set buffer via `call`', async () => {
        const res = await redis.call('set', Buffer.from('name'), Buffer.from('Peter'))

        expect(res).to.eql('OK')

        const result = await redis.callBuffer('get', Buffer.from('name'))

        expect(result).to.be.instanceof(Buffer)
        expect(result.toString()).to.eql('Peter')
    })

    it('should handle empty buffer', async () => {
        await redis.set(Buffer.from('name'), Buffer.from(''))

        const result = await redis.getBuffer(Buffer.from('name'))

        expect(result).to.be.instanceof(Buffer)
        expect(result.toString()).to.eql('')
    })

    it('should support utf8', async () => {
        await redis.set(Buffer.from('你好'), new String('你好'))

        const res = await redis.getBuffer('你好')

        expect(res.toString()).to.eql('你好')

        const result = await redis.get('你好')

        expect(result).to.eql('你好')
    })

    it('should consider null as empty str', async () => {
        await redis.set('name', null)

        const res = await redis.get('name')

        expect(res).to.eql('')
    })

    it('should support return int value', async () => {
        const exists = await redis.exists('name')

        expect(typeof exists).to.eql('number')
    })

    it('should reject when disconnected', async () => {
        await redis.disconnect()
        try {
            await redis.get('name')
        } catch (e) {
            expect(e.message).to.match(/Connection is closed./)
        }
    })

    it('should reject when enableOfflineQueue is disabled', async () => {
        const redisEnableOfflineQueue = new Redis({...global.OPTS_REDIS, enableOfflineQueue: false})
        try {
            await redisEnableOfflineQueue.get('name')
        } catch (e) {
            expect(e.message).to.match(/enableOfflineQueue options is false/)
        }
    })

    it('should support key prefixing', async () => {
        const redisKeyPrefix = new Redis({...global.OPTS_REDIS, keyPrefix: 'user:'})

        await redisKeyPrefix.set('name', 'Peter')

        const result = await redisKeyPrefix.get('name')

        expect(result).to.eql('Peter')

        const results = await redisKeyPrefix.keys('*')

        expect(results).to.eql(['user:name'])
    })

    it('should support key prefixing with multiple keys', async () => {
        const redisKeyPrefix = new Redis({...global.OPTS_REDIS, keyPrefix: 'user:'})

        await redisKeyPrefix.lpush('app1', 'Peter')
        await redisKeyPrefix.lpush('app2', 'Jimmy')
        await redisKeyPrefix.lpush('app3', 'Charles')

        const result = await redisKeyPrefix.blpop('app1', 'app2', 'app3', 0)
        expect(result).to.eql(['user:app1', 'Peter'])

        const results = await redisKeyPrefix.keys('*')
        expect(results).to.have.members(['user:app2', 'user:app3'])
    })

    it('should allow sending the loading valid commands in connect event', function (done) {
        const redisEnableOfflineQueue = new Redis({...global.OPTS_REDIS, enableOfflineQueue: false})
        redisEnableOfflineQueue.on('connect', async function () {
            const res = await redisEnableOfflineQueue.select(2)
            expect(res).to.eql('OK')
            done()
        })
    })

    it('should reject loading invalid commands in connect event', function () {
        const redisEnableOfflineQueue = new Redis({...global.OPTS_REDIS, enableOfflineQueue: false})
        redisEnableOfflineQueue.on('connect', async function () {
            try {
                await redisEnableOfflineQueue.get('name')
            } catch (e) {
                expect(e.message).to.eql('Stream is not writeable and enableOfflineQueue options is false')
            }
        })
    })

    it('throws for invalid command', async () => {
        const invalidCommand = 'áéűáű'
        let err
        try {
            await redis.call(invalidCommand, [])
        } catch (e) {
            err = e.message
        }
        expect(err).to.contain('unknown command')
        expect(err).to.contain(invalidCommand)
    })
})

