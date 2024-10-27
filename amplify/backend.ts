import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';

const storage = defineStorage({
  name: 'amplifyDrive',
});


defineBackend({
  auth,
  data,
  storage
});
