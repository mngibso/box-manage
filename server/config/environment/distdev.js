'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/managebox-dev'
  },
  mongobox: {
    uri:    process.env.BOX_MONGOLAB_URI
  },
  seedDB: true
};
