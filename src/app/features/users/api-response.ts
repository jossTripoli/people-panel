/*
Response structure to simulate a real HTTP Response:

status
headers
body
  items
  total
*/
export interface ApiResponse<T> {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly body: T;
}