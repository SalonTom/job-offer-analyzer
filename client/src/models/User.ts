import type { Factor } from "./Factor";

export class User {
    constructor(userObject?: Partial<User>) {
      this.id = userObject?.id;
      this.username = userObject?.username || '';
      this.first_name = userObject?.first_name || '';
      this.last_name = userObject?.last_name || '';
      this.email = userObject?.email || '';
      this.isActive = userObject?.isActive ?? true; // Set default to true
      this.factors = userObject?.factors ?? []
    }
  
    id?: number;
    username: string;
    password?: string; // Consider using a separate secure storage for password
    first_name?: string;
    last_name?: string;
    email: string;
    isActive?: boolean;
    factors: Factor[];
  }