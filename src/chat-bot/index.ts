import { kAuthorization, kSessionToken } from '@/config';

import { ChatGPT } from './chatgpt';

export const bot = new ChatGPT({
  sessionToken: kSessionToken,
  authorization: kAuthorization,
});
