const Redis = require('ioredis')
const {expect} = require('chai')

describe('Hash commands', () => {

    let redis
    before(()=> redis = new Redis(global.OPTS_REDIS))

    it('should get the values ​​of each field', async () => {
        await redis.hset('user:123', 'name', 'Peter', 'surname', 'Parker')
        const res1 = await redis.hget('user:123', 'name')
        expect(res1).to.eql('Peter')

        const res2 = await redis.hget('user:123', 'surname')
        expect(res2).to.eql('Parker')
    })

    it('should be considered null if the field or key does not exist', async () => {
        await redis.hset('user:123', 'name', 'Peter')
        const res1 = await redis.hget('user:123', 'surname')
        expect(res1).to.eql(null)

        const res2 = await redis.hget('user:not-exists', 'name')
        expect(res2).to.eql(null)
    })

    it('should support key prefixing for sort', async () => {
        const redisKeyPrefix = new Redis({...global.OPTS_REDIS, keyPrefix: 'user:'})
        await redisKeyPrefix.hset('object_1', 'name', 'better')
        await redisKeyPrefix.hset('weight_1', 'value', '20')
        await redisKeyPrefix.hset('object_2', 'name', 'best')
        await redisKeyPrefix.hset('weight_2', 'value', '30')
        await redisKeyPrefix.hset('object_3', 'name', 'good')
        await redisKeyPrefix.hset('weight_3', 'value', '10')
        await redisKeyPrefix.lpush('src', '1', '2', '3')
        await redisKeyPrefix.sort('src', 'BY', 'weight_*->value', 'GET', 'object_*->name', 'STORE', 'dest')

        const result = await redisKeyPrefix.lrange('dest', 0, -1)
        expect(result).to.eql(['good', 'better', 'best'])

        const results = await redisKeyPrefix.keys('*')
        expect(results).to.have.members([
            'user:object_1',
            'user:weight_1',
            'user:object_2',
            'user:weight_2',
            'user:object_3',
            'user:weight_3',
            'user:src',
            'user:dest'
        ])
    })

    it('should get the values ​​of each field (multi-get/multi-set)', async () => {
        await redis.hmset('user:123', 'created-by:name', 'Peter', 'created-by:username', '@parker')

        const res = await redis.hmget('user:123', 'created-by:name','created-by:username')
        expect(res[0]).to.eql('Peter')
        expect(res[1]).to.eql('@parker')
    })

    it('should be considered null if the field or key does not exist (multi-get/multi-set)', async () => {
        await redis.hmset('user:123', 'created-by:name', 'Peter', 'created-by:username', '@parker')

        const res = await redis.hmget('user:123', 'created-by:name','not-existing-field')
        expect(res[0]).to.eql('Peter')
        expect(res[1]).to.eql(null)
    })

    it('should get all the values (multi-get/multi-set)', async () => {
        await redis.hmset('user:123', 'created-by:name', 'Peter', 'created-by:username', '@parker')

        const res = await redis.hgetall('user:123')

        expect(res['created-by:name']).to.eql('Peter')
        expect(res['created-by:username']).to.eql('@parker')
    })

    it('should get the number of fields (multi-get/multi-set)', async () => {
        await redis.hmset('user:123', 'created-by:name', 'Peter', 'created-by:username', '@parker')

        const res1 = await redis.hlen('user:123')
        expect(res1).to.eql(2)

        const res2 = await redis.hkeys('user:123')
        expect(res2[0]).to.eql('created-by:name')
        expect(res2[1]).to.eql('created-by:username')

        const res3 = await redis.hvals('user:123')
        expect(res3[0]).to.eql('Peter')
        expect(res3[1]).to.eql('@parker')

        const res4 = await redis.hexists('user:123', 'created-by:name')
        expect(res4).to.eql(1)

        const res5 = await redis.hexists('user:123','not-exists-field')
        expect(res5).to.eql(0)
    })
})
