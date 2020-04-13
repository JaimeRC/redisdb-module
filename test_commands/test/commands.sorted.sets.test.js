const Redis = require('ioredis')
const {expect} = require('chai')

describe('Sorted Sets commands', () => {

    let redis
    before(() => redis = new Redis(global.OPTS_REDIS))

    it('should get an ordered set with its value', async () => {
        await redis.zadd('ss', 10, 'jaime')

        const res1 = await redis.zrange('ss', 0, -1)

        expect(res1[0]).to.eql('jaime')

        const res2 = await redis.zrange('ss', 0, -1, 'withscores')
        expect(res2[0]).to.eql('jaime')
        expect(res2[1]).to.eql('10')
    })

    it('should get an ordered set', async () => {
        await redis.zadd('ss', 10, 'jaime')
        await redis.zadd('ss', 20, 'fran')

        const res1 = await redis.zrange('ss', 0, -1)

        expect(res1[0]).to.eql('jaime')
        expect(res1[1]).to.eql('fran')
    })

    it('should override the value', async () => {
        await redis.zadd('ss', 10, 'jaime')
        await redis.zadd('ss', 20, 'jaime')

        const result = await redis.zrange('ss', 0, -1, 'withscores')

        expect(result[0]).to.eql('jaime')
        expect(result[1]).to.eql('20')
    })

    it('should get the size of the set', async () => {
        await redis.zadd('ss', 10, 'jaime')
        await redis.zadd('ss', 20, 'fran')

        const result = await redis.zcard('ss')

        expect(result).to.eql(2)
    })

    it('should get the items within limits', async () => {
        await redis.zadd('ss', 10, 'jaime')
        await redis.zadd('ss', 20, 'fran')
        await redis.zadd('ss', 30, 'anna')

        const result = await redis.zcount('ss', 15, 35)

        expect(result).to.eql(2)
    })

    it('should get the increment value of an element and sort descending', async () => {
        await redis.zadd('ss', 10, 'jaime')
        await redis.zadd('ss', 20, 'fran')
        await redis.zadd('ss', 30, 'anna')

        await redis.zincrby('ss', 40, 'anna')

        const result = await redis.zrevrange('ss', 0, -1, 'withscores')

        expect(result[0]).to.eql('anna')
        expect(result[1]).to.eql('70')
    })

    it('should get the value of each item', async () => {
        await redis.zadd('ss', 10, 'jaime')
        await redis.zadd('ss', 20, 'fran')
        await redis.zadd('ss', 30, 'anna')

        const res1 = await redis.zscore('ss', 'jaime')
        const res2 = await redis.zscore('ss', 'fran')
        const res3 = await redis.zscore('ss', 'anna')

        expect(res1).to.eql('10')
        expect(res2).to.eql('20')
        expect(res3).to.eql('30')
    })

    it('should remove the first element', async () => {
        await redis.zadd('ss', 10, 'jaime')
        await redis.zadd('ss', 20, 'fran')

        await redis.zrem('ss', 'jaime')

        const result = await redis.zrange('ss', 0, -1)

        expect(result[0]).to.eql('fran')
        expect(result[1]).to.eql(undefined)
    })
})
