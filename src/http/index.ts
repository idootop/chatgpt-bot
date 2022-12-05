import axios, { AxiosRequestConfig } from 'axios';

const _baseConfig = {
  headers: {
    'Content-Type': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:107.0) Gecko/20100101 Firefox/107.0',
  },
};

export const httpRow = axios.create(_baseConfig);

const _http = axios.create(_baseConfig);

('data: {"message": {"id": "f17731c2-8903-4179-8d12-a03954e4c03b", "role": "assistant", "user": null, "create_time": null, "update_time": null, "content": {"content_type": "text", "parts": []}, "end_turn": null, "weight": 1.0, "metadata": {}, "recipient": "all"}, "conversation_id": "5d6bd712-00ca-45f2-aa5d-7ca59c618634", "error": null}\n\ndata: {"message": {"id": "f17731c2-8903-4179-8d12-a03954e4c03b", "role": "assistant", "user": null, "create_time": null, "update_time": null, "content": {"content…": "text", "parts": ["\\u4f60\\u597d\\uff01\\u5f88\\u9ad8\\u5174\\u89c1\\u5230\\u4f60\\u3002\\u6211\\u662f Assistant\\uff0c\\u4e00\\u4e2a\\u5927\\u578b\\u8bed\\u8a00\\u6a21\\u578b\\uff0c\\u7531 OpenAI \\u8bad\\u7ec3\\u3002\\u6211\\u80fd\\u56de\\u7b54\\u5404\\u79cd\\u95ee\\u9898\\uff0c\\u8bf7\\u95ee\\u6709\\u4ec0\\u4e48\\u53ef\\u4ee5\\u4e3a\\u60a8\\u6548\\u52b3\\u7684\\u5417\\uff1f"]}, "end_turn": null, "weight": 1.0, "metadata": {}, "recipient": "all"}, "conversation_id": "5d6bd712-00ca-45f2-aa5d-7ca59c618634", "error": null}\n\ndata: [DONE]\n\n');

interface HttpError {
  isError: true;
  code: string;
  message: string;
}

_http.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const apiError: HttpError = {
      isError: true,
      code: err.response?.data?.code ?? err.code ?? 'UNKNOWN CODE',
      message: err.response?.data?.msg ?? err.message ?? 'UNKNOWN ERROR',
    };
    console.error(
      '❌ Network request failed:',
      apiError.code,
      apiError.message,
    );
    return apiError;
  },
);

export const http = {
  get<T = any>(
    url: string,
    query?: Record<string, string | number | boolean | undefined>,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<T | HttpError> {
    if (query) {
      url +=
        '?' +
        Object.entries(query)
          .map(
            ([k, v = '']) =>
              `${encodeURIComponent(k)}=${encodeURIComponent(v)}`,
          )
          .join('&');
    }
    return _http.get<T>(url, config) as any;
  },
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<T | HttpError> {
    return _http.post<T>(url, data, config) as any;
  },
};
