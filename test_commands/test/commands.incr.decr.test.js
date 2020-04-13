const Redis = require('ioredis')
const {expect} = require('chai')

describe('Increment and Decrement Command (atomic)', () => {

    let redis
    before(()=> redis = new Redis(global.OPTS_REDIS))

    it('should get the increased value', async () => {
        await redis.set('version', 1);

        await redis.incr('version')

        const result = await redis.get('version')

        expect(result).to.be.a('string')
        expect(parseInt(result)).to.eql(2)
    })

    it('should get the decremented value', async () => {
        await redis.set('version', 10);

        await redis.decr('version')

        const result = await redis.get('version')

        expect(result).to.be.a('string')
        expect(parseInt(result)).to.eql(9)
    })

    it('should get the increased value by 5', async () => {
        await redis.set('version', 10)

        await redis.incrby('version',5)

        const result = await redis.get('version')

        expect(result).to.be.a('string')
        expect(parseInt(result)).to.eql(15)
    })

    it('should get the decremented value by 5', async () => {
        await redis.set('version', 10)

        await redis.decrby('version',5)

        const result = await redis.get('version')

        expect(result).to.be.a('string')
        expect(parseInt(result)).to.eql(5)
    })

    it('should get the increased value in hash', async () => {
        await redis.hset('post:1','title','whatever','views',0)

        await redis.hincrby('post:1','views',4)

        const result = await redis.hget('post:1','views')

        expect(result).to.be.a('string')
        expect(parseInt(result)).to.eql(4)
    })

    it('should get the decremented value in hash', async () => {
        await redis.hset('post:1','title','whatever','views',5)

        // No exist hdecrby command
        await redis.hincrby('post:1','views',-2)

        const result = await redis.hget('post:1','views')

        expect(result).to.be.a('string')
        expect(parseInt(result)).to.eql(3)
    })

})
