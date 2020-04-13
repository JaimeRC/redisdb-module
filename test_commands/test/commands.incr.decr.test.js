const Redis = require('ioredis')
const {expect} = require('chai')

describe('Increment Command', () => {

    let redis
    before(()=> redis = new Redis(global.OPTS_REDIS))

    it("should get the increased value", async () => {
        await redis.set("user:123", "name", "Peter", "surname", "Parker");
        const res1 = await redis.hget("user:123", "name")
        expect(res1).to.eql("Peter")

        const res2 = await redis.hget("user:123", "surname")
        expect(res2).to.eql("Parker")
    })
})
