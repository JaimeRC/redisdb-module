const Redis = require('ioredis')
const {expect} = require('chai')

describe('List commands', () => {

    let redis
    before(() => redis = new Redis(global.OPTS_REDIS))

    it('should get a list with four elements adding to the beginning of the list', async () => {
        await redis.lpush('users', 1, 2, 3, 4)

        const result = await redis.lrange('users', 0, -1)

        expect(result.length).to.eql(4)
    })


    it('should get a list with four elements adding to the end of the list', async () => {
        await redis.rpush('users', 1, 2, 3, 4)

        const result = await redis.lrange('users', 0, -1)

        expect(result.length).to.eql(4)
    })

    it('should get different length of items from a list', async () => {
        await redis.rpush('list', 'uno', 'dos', 'tres', 'cuatro')

        const res1 = await redis.lrange('list', 0, -1)
        const res2 = await redis.lrange('list', 0, 0)
        const res3 = await redis.lrange('list', 0, 1)
        const res4 = await redis.lrange('list', 0, 2)
        const res5 = await redis.lrange('list', 0, -2)

        expect(res1.length).to.eql(4)
        expect(res2.length).to.eql(1)
        expect(res3.length).to.eql(2)
        expect(res4.length).to.eql(3)
        expect(res5.length).to.eql(3)
    })

    it('should get the size of a list', async () => {
        await redis.rpush('list', 'uno', 'dos', 'tres', 'cuatro')

        const result = await redis.llen('list')

        expect(result).to.eql(4)
    })

    it('should get the list without the elements repeated', async () => {
        await redis.rpush('list', 'uno', 'hola', 'dos', 'hola', 'tres', 'hola', 'cuatro')

        await redis.lrem('list', 0, 'hola')

        const result = await redis.lrange('users', 0, -1)

        for (let item of result) {
            expect(item).not.to.eql('hola')
        }
    })

    it('should return the first item in the list', async () => {
        await redis.rpush('list', 'uno', 'hola', 'dos', 'hola', 'tres', 'hola', 'cuatro')

        const result = await redis.lpop('list')

        expect(result).to.eql('uno')

        await redis.lrange('users', 0, -1)

        for (let item of result) {
            expect(item).not.to.eql('uno')
        }
    })

    it('should check if the list exists or not', async () => {
        await redis.rpush('list', 'uno', 'dos')

        const res1 = await redis.exists('list')

        expect(res1).to.eql(1)

        await redis.lpop('list')
        await redis.lpop('list')

        const res2 = await redis.exists('list')

        expect(res2).to.eql(0)
    })

    it('should get a limited size list', async () => {
        await redis.lpush('comments', 'c1', 'c2', 'c3', 'c4')

        const res1 = await redis.llen('comments')

        expect(res1).to.eql(4)

        await redis.ltrim('comments', 0, 2)

        const res2 = await redis.llen('comments')

        expect(res2).to.eql(3)

    })

})
