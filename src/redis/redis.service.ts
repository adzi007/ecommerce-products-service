import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import 'dotenv/config';

@Injectable()
export class RedisService {
    private readonly client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
        });
    }

    async set(key: string, value: any, expiration?: number) {
        const serializedValue = JSON.stringify(value); 
        if (expiration) {
          await this.client.set(key, serializedValue, 'EX', expiration); 
        } else {
          await this.client.set(key, serializedValue);
        }
      }

    // async set(key: string, value: any, expiration?: number): Promise<boolean> {
    //   try {
    //     if (expiration) {
    //       await this.client.set(key, value, 'EX', expiration); 
    //     } else {
    //       await this.client.set(key, value);
    //     }
    //     return true; // Return true if the set operation was successful
    //   } catch (error) {
    //     console.error('Error setting value in Redis:', error);
    //     return false; // Return false if an error occurred
    //   }
    // }

    
    async get(key: string): Promise<any> {
      const data = await this.client.get(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    }
    

    async mset(keysAndValues: Record<string, string>) {
        const keys = Object.keys(keysAndValues);
        const values = Object.values(keysAndValues);
        const args: (string | number | Buffer)[] = [...keys, ...values]; // Combine keys and values into a single array
    
        await this.client.mset(...args); 
    }

    async mget(keys: string[]) {
        return await this.client.mget(keys);
    }

    async del(key: string) {
        await this.client.del(key);
    }

    async close() {
        await this.client.disconnect();
    }

    async setLock(key: string, value: string, ttl: number): Promise<boolean> {
      try {
        const result = await this.client.set(key, value, 'EX', ttl, 'NX'); 
        return result === 'OK'; // 'NX' option returns 'OK' on success
      } catch (error) {
        console.error('Error setting lock:', error);
        return false;
      }
    }
  
    async releaseLock(key: string, value: string): Promise<boolean> {
      const script = `
        if redis.call('get', KEYS[1]) == ARGV[1] then
          return redis.call('del', KEYS[1])
        else
          return 0
        end
      `;
  
      try {
        const result = await this.client.eval(script, 1, key, value); 
        return result === 1; 
      } catch (error) {
        console.error('Error releasing lock:', error);
        return false;
      }
    }
}