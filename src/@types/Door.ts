export type Door = {
  id: string;
  name: string;
  description?: string;
  location?: string;
  active: boolean;
  status?: string;
  isOpen?: boolean;
  createdAt: string;
  updatedAt?: string;
};