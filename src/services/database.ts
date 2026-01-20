import { MongoClient, Db, Collection, Document } from 'mongodb';
import databaseConfig from '../config/database.js';

/**
 * MongoDB Database Service
 * Provides centralized database connection management
 */
class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnecting: boolean = false;

  /**
   * Connect to MongoDB Atlas
   * This should be called once during application startup
   */
  async connect(): Promise<void> {
    // Prevent multiple simultaneous connection attempts
    if (this.isConnecting) {
      throw new Error('Database connection already in progress');
    }

    // Return if already connected
    if (this.client && this.db) {
      console.log('✅ Database already connected');
      return;
    }

    // Validate connection URI
    if (!databaseConfig.uri) {
      throw new Error('MONGO_URL environment variable is not set');
    }

    try {
      this.isConnecting = true;
      console.log('🔌 Connecting to MongoDB Atlas...');

      // Create MongoDB client
      this.client = new MongoClient(databaseConfig.uri, databaseConfig.options);

      // Connect to the database
      await this.client.connect();

      // Get database instance
      this.db = this.client.db(databaseConfig.databaseName);

      // Verify connection with a ping
      await this.db.admin().ping();

      console.log(`✅ Successfully connected to MongoDB database: ${databaseConfig.databaseName}`);
    } catch (error) {
      this.client = null;
      this.db = null;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ MongoDB connection error:', errorMessage);
      throw new Error(`Failed to connect to MongoDB: ${errorMessage}`);
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Get the database instance
   * Throws an error if not connected
   */
  getDatabase(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  /**
   * Get a typed collection from the database
   * @param collectionName - Name of the collection
   * @returns Typed MongoDB collection
   */
  getCollection<T extends Document = Document>(collectionName: string): Collection<T> {
    return this.getDatabase().collection<T>(collectionName);
  }

  /**
   * Check if database is connected
   */
  isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }

  /**
   * Gracefully close the database connection
   * This should be called during application shutdown
   */
  async close(): Promise<void> {
    if (this.client) {
      console.log('🔌 Closing MongoDB connection...');
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('✅ MongoDB connection closed');
    }
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService();

// Export the class for testing purposes
export default DatabaseService;

