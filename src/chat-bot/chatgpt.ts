import { http, httpRow } from '@/http';
import { uuidv4 } from '@/utils/uuid';

interface ChatGPTConversationPos {
  parentID: string;
  conversationID: string;
}

export interface ChatGPTConfig extends Partial<ChatGPTConversationPos> {
  sessionToken: string;
  authorization?: string;
  model?: 'text-davinci-002-render';
}

export class ChatGPT {
  config?: ChatGPTConfig;
  constructor(config: ChatGPTConfig) {
    this.config = config;
  }

  async init() {
    await this.refreshToken();
  }

  async refreshToken(props?: { force: boolean }) {
    const { force = false } = props ?? {};
    if (force || !this.config?.authorization) {
      const response = await httpRow
        .get('https://chat.openai.com/api/auth/session', {
          headers: this.headers,
        })
        .catch(() => undefined);

      const newSessionCookie = response?.headers?.['set-cookie']?.find((e) =>
        e.includes('__Secure-next-auth.session-token'),
      );

      const newSessionToken = newSessionCookie
        ?.replace('__Secure-next-auth.session-token=', '')
        ?.split('; Path=/;')[0];
      const newAuthorization = response?.data?.['accessToken'];
      if (newSessionToken) {
        this.config!.sessionToken = newSessionToken;
      }
      if (newAuthorization) {
        this.config!.authorization = newAuthorization;
      }
    }
  }

  get headers() {
    const cookies = {
      '__Secure-next-auth.session-token': this.config!.sessionToken,
    };
    return {
      Cookie: Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join(';'),
      ...(this.config!.authorization
        ? { Authorization: this.config!.authorization }
        : undefined),
    };
  }

  async ask(prompt: string): Promise<string | undefined> {
    await this.init();
    const queryDatas = {
      action: 'next',
      messages: [
        {
          id: uuidv4(),
          role: 'user',
          content: { content_type: 'text', parts: [prompt] },
        },
      ],
      conversation_id: this.config!.conversationID,
      parent_message_id: this.config!.parentID ?? uuidv4(),
      model: this.config!.model ?? 'text-davinci-002-render',
    };
    const response = await http.post(
      'https://chat.openai.com/backend-api/conversation',
      queryDatas,
      {
        headers: this.headers,
      },
    );
    if (response && !response.isError) {
      const datas = this.getResponseData(response);
      const parentID = datas['message']?.['id'];
      const conversationID = datas['conversation_id'];
      const answer = datas['message']?.['content']?.['parts']?.[0];
      if (parentID) {
        this.config!.parentID = parentID;
      }
      if (conversationID) {
        this.config!.conversationID = conversationID;
      }
      return answer;
    }
  }

  getResponseData(data: string) {
    const temp = data.split('\n');
    try {
      if (temp.length > 4) {
        const dataStr = temp
          .slice(temp.length - 5, temp.length - 4)[0]
          .replace('data: ', '');
        return JSON.parse(dataStr);
      }
    } catch (e) {
      return undefined;
    }
  }
}
