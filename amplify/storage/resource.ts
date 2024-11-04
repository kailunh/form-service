import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'form-files',
  access: (allow) => ({
    'forms/{entity_id}/*': [
      // {entity_id} is the token that is replaced with the user identity id
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.guest.to(['read']),
      allow.authenticated.to(['read'])
    ]
  })
});