const Redis = require('ioredis')
const {expect} = require('chai')

describe('Request Limit Exercise', () => {

    let redis
    before(() => redis = new Redis(global.OPTS_REDIS))

    it("should get permission because it doesn't exceed 10 requests", async () => {
         await redis.hset("user:123", "rateLimit", "10s", "request", "0")

        Array(5).fill(' ').forEach(async () =>await redis.hincrby('user:123', "request", 1))

        if (await redis.ttl("user:123:rate-limit:10s") === -1) {
            await redis.expire("user:123:rate-limit:10s", 10)
        }

        const result = await redis.hget("user:123", "request")

        expect(result).to.be.a('string')
        expect(parseInt(result)).to.eql(5)
    })

    it("should get permission because it does exceed 10 requests", async () => {
        await redis.hset("user:123", "rateLimit", "10s", "request", "0")

        Array(15).fill(' ').forEach(async () =>await redis.hincrby('user:123', "request", 1))

        if (await redis.ttl("user:123:rate-limit:10s") === -1) {
            await redis.expire("user:123:rate-limit:10s", 2)
        }

        const result = await redis.hget("user:123", "request")

        expect(result).to.be.a('string')
        expect(parseInt(result)).not.to.eql(10)
    })

    /*  contador = (INCR user:123:rate-limit:10s 1)

  if(TTL user:123:rate-limit:10s) === -1){
      expire user:123:rate-limit:10s 1
  }

  if(contador > 15)
      abort(429, "Too may request! Quota exceeded!")
  })*/
})
