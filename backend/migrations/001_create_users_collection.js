/**
 * Migration: Create users collection with indexes
 * Run: node migrations/001_create_users_collection.js
 */

const mongoose = require('mongoose');
require('dotenv').config();
const { connectDB, disconnectDB } = require('../src/config/database');
const logger = require('../src/utils/logger');

const createUsersCollection = async () => {
  try {
    await connectDB();
    logger.info('Starting migration: Create users collection');

    const db = mongoose.connection.db;

    // Check if collection exists
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length > 0) {
      logger.info('Users collection already exists');
      return;
    }

    // Create collection with validation
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'role'],
          properties: {
            firstName: {
              bsonType: 'string',
              description: 'First name of the user',
            },
            lastName: {
              bsonType: 'string',
              description: 'Last name of the user',
            },
            email: {
              bsonType: 'string',
              description: 'Email address (unique)',
            },
            password: {
              bsonType: 'string',
              description: 'Hashed password',
            },
            phoneNumber: {
              bsonType: 'string',
              description: 'Phone number',
            },
            role: {
              enum: ['customer', 'collector', 'admin'],
              description: 'User role',
            },
            isActive: {
              bsonType: 'bool',
              description: 'User account status',
            },
            createdAt: {
              bsonType: 'date',
              description: 'Account creation date',
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Last update date',
            },
          },
        },
      },
    });

    logger.info('Users collection created successfully');

    // Create indexes
    const collection = db.collection('users');
    await collection.createIndex({ email: 1 }, { unique: true });
    logger.info('Created unique index on email');

    await collection.createIndex({ role: 1 });
    logger.info('Created index on role');

    await collection.createIndex({ createdAt: -1 });
    logger.info('Created index on createdAt');

    await collection.createIndex({ isActive: 1 });
    logger.info('Created index on isActive');

    logger.info('Migration completed successfully');
  } catch (error) {
    logger.error(`Migration error: ${error.message}`);
    throw error;
  } finally {
    await disconnectDB();
  }
};

// Run migration
if (require.main === module) {
  createUsersCollection()
    .then(() => {
      logger.info('Migration finished');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration failed', error);
      process.exit(1);
    });
}

module.exports = createUsersCollection;