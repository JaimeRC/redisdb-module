const Redis = require('ioredis')
const {expect} = require('chai')

describe('Connection', () => {

    it('should emit "connect" when connected', function (done) {
        const redis = new Redis(global.OPTS_REDIS);
        redis.on("connect", function () {
            redis.disconnect();
            done();
        });
    });

    it('should emit "close" when disconnected', function (done) {
        const redis = new Redis(global.OPTS_REDIS);
        redis.once("end", done);
        redis.once("connect", function () {
            redis.disconnect();
        });
    });

    it("should reject when connected", async () => {
        const redis = new Redis(global.OPTS_REDIS)
        try {
            await redis.connect()
        } catch (e) {
            expect(e.message).to.match(/Redis is already connecting/);
            redis.disconnect();
        }
    })

    it("should resolve when the status become ready", async () => {
        const redis = new Redis({...global.OPTS_REDIS, lazyConnect: true});
        await redis.connect()
        expect(redis.status).to.eql("ready")
        redis.disconnect();
    });

    it("should reject when closed (reconnecting)", async () => {
        let opt = {
            port: 8989,
            lazyConnect: true,
            retryStrategy: function () {
                return 0
            }
        }

        const redis = new Redis(opt);

        try {
            await redis.connect()
        } catch (e) {
            expect(redis.status).to.eql("reconnecting");
            redis.disconnect();
        }
    });

    it("should reject when closed (end)", async () => {
        let opt = {
            port: 8989,
            lazyConnect: true,
            retryStrategy: null
        }
        const redis = new Redis(opt);

        try {
            await redis.connect()
        } catch (e) {
            expect(redis.status).to.eql("end");
            redis.disconnect();
        }
    })
})

