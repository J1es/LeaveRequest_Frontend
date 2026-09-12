import { authContext, authMiddleware, type User } from "~/libs/auth";
import type { Route } from "./+types/adminactionrequests";
import Navbar from "~/components/NavBar";
import { authenticatedApiRequest } from "~/libs/api";
import { redirect, useFetcher, useLoaderData} from "react-router";
import type { LeaveRequest } from "~/types/LeaveRequest";
import { useEffect, useState } from "react";
import type { Employee } from "~/types/Employee";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Admin Actions" },
        { name: "Manage Requests", content: "List of Staff Members Requests" },
    ];
}

export async function loader({ params, context }: Route.LoaderArgs) {
    const user = context.get(authContext) as User;

    if (user.role !== "admin") {
        return redirect("/");
    }

    const employeeId = Number(params.employeeId);

    const employeeResponse =
        await authenticatedApiRequest(
            context,
            `/api/users/${employeeId}`
        );

    const employeeData = await employeeResponse.json();

    const employeeRecord = employeeData.data as Employee | undefined;

    if (!employeeRecord) {
        return redirect("/");
    }

    const leaveRequestsResponse = await authenticatedApiRequest(
        context,
        `api/leave-requests/status/${employeeId}`
    );

    if (!leaveRequestsResponse.ok) {
        return new Response(
            "Failed to fetch remaining leave requests",
            { status: leaveRequestsResponse.status }
        );
    }

    const response = await leaveRequestsResponse.json();
    const requests: LeaveRequest[] = response.data.data;

    const leaveRequests = requests.map((request) => ({
        id: request.id,
        startDate: request.start_date,
        endDate: request.end_date,
        status: request.status,
        reason: request.reason ?? "No reason provided",
    }));

    return { leaveRequests, employeeName: `${employeeRecord.firstName} ${employeeRecord.surname}`,};
}

export async function action({ request, context }: Route.ActionArgs) {
    const formData = await request.formData();

    const requestId = Number(formData.get("requestId"));
    const reason = String(formData.get("reason"));
    const actionMethod = String(formData.get("actionMethod"));

    if (!requestId || Number.isNaN(requestId)) {
        return {
            error: "Invalid leave request."
        };
    }

    if (!reason.trim()) {
        return { error: "Please Enter a valid reason." };
    }

    try {
        let response: Response;

        if (actionMethod === "Approve") {
            response = await authenticatedApiRequest(
                context,
                "api/leave-requests/approve",
                {
                    method: "PATCH",
                    body: {
                        leaveRequestId: requestId,
                        reason,
                    },
                }
            );
        }
        else if (actionMethod === "Reject") {
            response = await authenticatedApiRequest(
                context,
                "api/leave-requests/reject",
                {
                    method: "PATCH",
                    body: {
                        leaveRequestId: requestId,
                        reason,
                    },
                }
            );
        }
        else { return { error: "Invalid action" } }

        if (!response.ok && actionMethod === "Approve") {
            return {
                success: false,
                error: "Failed to Approve request",
            };
        }
        else if (!response.ok && actionMethod === "Reject") {
            return {
                success: false,
                error: "Failed to Reject request",
            };
        }
        
        return { success: true };

    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "An unexpected error occurred"
        };
    }
}

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];

export default function AdminActionRequests() {

    const { leaveRequests, employeeName } = useLoaderData<typeof loader>();

    const [showManageActionModal, setShowManageActionModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [reason, setReason] = useState("");
    const [actionMethod, setActionMethod] = useState("");
    const [ManageActionError, setError] = useState("");

    const manageActionRequestFetcher = useFetcher<{
        success?: boolean;
        error?: string;
    }>();

    useEffect(() => {
        if (manageActionRequestFetcher.data?.success) {
            setShowManageActionModal(false);
            setActionMethod("");
            setReason("");
            setSelectedRequestId(null);
        }
        if (manageActionRequestFetcher.data?.error) {
            setError(manageActionRequestFetcher.data.error);
        }
    }, [manageActionRequestFetcher.data]);

    return <>
        <Navbar navBarTitle="Admin Actions" />
        <main className="min-h-screen pt-12 text-Bgen-Navy-500">
            <div
                className="
                max-w-xs
                md:max-w-3xl
                lg:max-w-5xl
                mx-auto
                border
                rounded-xl
                p-6">

                <h1 className="text-2xl md:text-3xl font-bold text-center whitespace-nowrap pb-3 md:pb-5">
                    {employeeName}'s Requests
                </h1>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                    {leaveRequests.map((request) => (
                        <div
                            key={request.id}
                            className="
                            group
                            w-64
                            md:w-72
                            bg-linear-to-br
                            from-Bgen-SkyBlue-100
                            to-Bgen-SkyBlue-300
                            shadow-lg
                            p-6
                            transition-all
                            duration-200
                            hover:-translate-y-2
                            hover:shadow-2xl
                            rounded-xl
                            select-none">

                            <h2 className="text-xl font-bold text-Bgen-Navy-500 mb-4">
                                Request #{request.id}
                            </h2>

                            <div className="space-y-2">
                                <p><strong>Start Date:<br /></strong> {request.startDate}</p>
                                <p><strong>End Date:<br /></strong> {request.endDate}</p>
                                <p><strong>Status:<br /></strong> {request.status}</p>
                                <p className="wrap-break-word"><strong>Reason:<br /></strong> {request.reason}</p>
                                <div className="flex flex-row">
                                    {request.status === "Pending" && (
                                        <button
                                            tabIndex={0}
                                            type="button"
                                            className="
                                            block
                                            w-45
                                            p-1
                                            mx-auto
                                            font-medium
                                            bg-Bgen-Green-400
                                            rounded-lg
                                            shadow-md
                                            cursor-pointer"
                                            onClick={() => {
                                                setSelectedRequestId(request.id);
                                                setActionMethod("Approve");
                                                setError("");
                                                setShowManageActionModal(true);
                                            }}>
                                            Approve
                                        </button>)}
                                    {request.status === "Pending" && (
                                        <button
                                            tabIndex={0}
                                            type="button"
                                            className="
                                            block
                                            w-45
                                            p-1
                                            mx-auto
                                            font-medium
                                            bg-Bgen-Orange-400
                                            rounded-lg
                                            shadow-md
                                            cursor-pointer"
                                            onClick={() => {
                                                setSelectedRequestId(request.id);
                                                setActionMethod("Reject");
                                                setError("");
                                                setShowManageActionModal(true);
                                            }}>
                                            Reject
                                        </button>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>

        {showManageActionModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-Bgen-Navy-300/50">
                <div className="bg-Bgen-Blue-100 rounded-lg p-6 w-96">
                    <h2 className="text-xl font-bold mb-4">
                        {actionMethod === "Approve" ? "Approve" : "Reject"} Request
                    </h2>

                    {ManageActionError && (
                        <div className="mb-4 rounded-md bg-Bgen-Orange-100 p-4 border border-Bgen-Orange-300">
                            <p className="text-sm font-bold text-Bgen-Orange-500">
                                {ManageActionError}
                            </p>
                        </div>
                    )}

                    <label>
                        Reason
                        <textarea
                            id="reason"
                            name="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border rounded p-2 mt-1"
                        />
                    </label>

                    <manageActionRequestFetcher.Form method="post">
                        <input
                            type="hidden"
                            name="requestId"
                            value={selectedRequestId ?? ""}
                        />

                        <input
                            type="hidden"
                            name="reason"
                            value={reason}
                        />

                        <input
                            type="hidden"
                            name="actionMethod"
                            value={actionMethod}
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                tabIndex={0}
                                type="button"
                                className="w-45 p-1
                                        mx-auto
                                        font-medium
                                        border
                                        border-Bgen-Orange-500 
                                        rounded-lg
                                        shadow-md
                                        hover:-translate-y-0.5
                                        hover:shadow-lg
                                        active:translate-y-1
                                        transition-all 
                                        duration-60
                                        cursor-pointer"
                                onClick={() => {
                                    setShowManageActionModal(false);
                                    setActionMethod("");
                                    setReason("");
                                }}
                            >
                                Close
                            </button>

                            <button
                                tabIndex={0}
                                type="submit"
                                disabled={manageActionRequestFetcher.state === "submitting"}
                                className="w-45 p-1
                                        mx-auto
                                        font-medium
                                        bg-Bgen-Orange-400 
                                        rounded-lg
                                        shadow-md
                                        hover:-translate-y-0.5
                                        hover:shadow-lg
                                        active:translate-y-1
                                        transition-all 
                                        duration-60
                                        cursor-pointer"
                            >
                                {manageActionRequestFetcher.state === "submitting" ? "Submitting..." : "Confirm"}
                            </button>
                        </div>
                    </manageActionRequestFetcher.Form>
                </div>
            </div>
        )}

    </>
}