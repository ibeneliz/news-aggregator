const redis =   require('redis');

class RedisClient {
  constructor() {
    this.Client = null;
  }

  async connect() {
    if (!this.Client) {
      this.Client = await redis.createClient();
    }

    try {
      await this.Client.connect();
      console.log('Connected to Redis:');
    } catch (error) {
      console.log('Error connecting to Redis:', error);
    }
    return this.Client;
  }
}

module.exports = new RedisClient();