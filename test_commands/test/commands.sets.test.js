const Redis = require('ioredis')
const {expect} = require('chai')

describe('Command Sets', () => {

    let redis
    before(() => redis = new Redis(global.OPTS_REDIS))

    it("should get a value one because the user doesn't exist", async () => {

        const result = await redis.sadd('users:blocked', 'Pepe')

        expect(result).to.eql(1)
    })

    it("should get a value zero because the user exists", async () => {

        await redis.sadd('users:blocked', 'Pepe')

        const result = await redis.sadd('users:blocked', 'Pepe')

        expect(result).to.eql(0)
    })

    it("should get a value zero because the user exists", async () => {

        await redis.sadd('users:blocked', 'Pepe')

        const result = await redis.sadd('users:blocked', 'Pepe')

        expect(result).to.eql(0)
    })

    it("should get the number of members", async () => {

        await redis.sadd('users:blocked', 'Pepe')
        await redis.sadd('users:blocked', 'Paco')
        await redis.sadd('users:blocked', 'Antonio')

        const result = await redis.scard('users:blocked')

        expect(result).to.eql(3)
    })

    it("should get all the members", async () => {

        await redis.sadd('users:blocked', 'Pepe')
        await redis.sadd('users:blocked', 'Paco')
        await redis.sadd('users:blocked', 'Antonio')

        const result = await redis.smembers('users:blocked')

        expect(result.length).to.eql(3)
    })

    it("should get value one if user exists", async () => {

        await redis.sadd('users:blocked', 'Pepe')
        await redis.sadd('users:blocked', 'Paco')
        await redis.sadd('users:blocked', 'Antonio')

        const result = await redis.sismember('users:blocked','Pepe')

        expect(result).to.eql(1)
    })

    it("should get value zero if user doesn't exists", async () => {

        await redis.sadd('users:blocked', 'Pepe')
        await redis.sadd('users:blocked', 'Paco')
        await redis.sadd('users:blocked', 'Antonio')

        const result = await redis.sismember('users:blocked','Manolo')

        expect(result).to.eql(0)
    })

    it("should get value one if user has been deleted", async () => {

        await redis.sadd('users:blocked', 'Pepe')
        await redis.sadd('users:blocked', 'Paco')

        const result = await redis.srem('users:blocked','Pepe')

        expect(result).to.eql(1)
    })

    it("should get zero if the user has not been deleted", async () => {

        await redis.sadd('users:blocked', 'Pepe')
        await redis.sadd('users:blocked', 'Antonio')

        const result = await redis.sismember('users:blocked','Manolo')

        expect(result).to.eql(0)
    })

    it("should get the difference between sets", async () => {

        await redis.sadd('users:logged', 'Pepe','Manolo')
        await redis.sadd('users:updated', 'Manolo')

        const result = await redis.sdiff('users:logged','users:updated')

        expect(result[0]).to.eql('Pepe')
    })

    it("should get intersection between sets", async () => {

        await redis.sadd('users:logged', 'Pepe','Manolo')
        await redis.sadd('users:updated', 'Manolo')

        const result = await redis.sinter('users:logged','users:updated')

        expect(result[0]).to.eql('Manolo')
    })

    it("should show all users in sets", async () => {

        await redis.sadd('users:logged', 'Pepe','Manolo')
        await redis.sadd('users:updated', 'Manolo','Antonio')

        const result = await redis.sunion('users:logged','users:updated')

        expect(result.length).to.eql(3)
    })

})
