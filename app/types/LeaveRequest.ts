export type LeaveRequest = {
    id: number;
    start_date: string;
    end_date: string;
    status: string;
    reason: string | null;
}