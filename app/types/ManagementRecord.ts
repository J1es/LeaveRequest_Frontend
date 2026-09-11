export type ManagementRecord = {
    id: number;
    user: {
        id: number;
        firstName: string;
        surname: string;
        email: string;
        leaveBalance: number;
    };
    manager: {
        id: number;
        firstName: string;
        surname: string;
        email: string;
    };
    startDate: string;
    endDate: string | null;
}