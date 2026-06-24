export type Contact = {
  id: number;
  fullName: string;
  position: string;
  department: string;
  building: string;
  officeNumber: string;
  internalPhone: string;
  cityPhone: string;
  mobilePhone: string;
  email: string;
  login: string;
  password: string;
  role: number; // ИЗМЕНИТЕ с 0 | 1 на number, так как из БД приходит число
};


