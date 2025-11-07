export interface User {
  id: number;
  name: string;
  email: string;
  category: 'admin' | 'user' | 'guest';
}
