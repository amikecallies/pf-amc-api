import type { MongoClientOptions } from 'mongodb';

/**
 * MongoDB connection configuration
 */
export const databaseConfig = {
  /**
   * MongoDB connection URI from environment variables
   * Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   */
  uri: process.env.MONGO_URL || '',

  /**
   * MongoDB client options for connection pooling and reliability
   */
  options: {
    maxPoolSize: 10, // Maximum number of connections in the pool
    minPoolSize: 2, // Minimum number of connections in the pool
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    serverSelectionTimeoutMS: 5000, // Timeout for selecting a server
    socketTimeoutMS: 45000, // Timeout for socket operations
    retryWrites: true, // Automatically retry write operations
    retryReads: true, // Automatically retry read operations
  } as MongoClientOptions,

  /**
   * Database name (extracted from URI or set explicitly)
   * If not in URI, defaults to 'portfolio'
   */
  get databaseName(): string {
    if (!this.uri) return 'portfolio';
    
    try {
      // Extract database name from connection string
      const match = this.uri.match(/\.net\/([^?]+)/);
      return match ? match[1] : 'portfolio';
    } catch {
      return 'portfolio';
    }
  },
};

export default databaseConfig;

