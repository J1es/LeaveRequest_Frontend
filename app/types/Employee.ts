export interface Employee {
    id: number;
    firstName: string;
    surname: string;
    email: string;
    role: {
        id: number;
        name: string;
    };
    leaveBalance: number;
}