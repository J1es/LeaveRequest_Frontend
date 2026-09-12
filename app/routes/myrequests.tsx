import { authContext, authMiddleware, type User } from "~/libs/auth";
import type { Route } from "./+types/myrequests";
import Navbar from "~/components/NavBar";
import { authenticatedApiRequest } from "~/libs/api";
import { useFetcher, useLoaderData, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import type { LeaveRequest } from "~/types/LeaveRequest";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "My Requests" },
        { name: "my requests", content: "List of User Requests" },
    ];
}

export async function loader({ context }: Route.LoaderArgs) {
    const user = context.get(authContext) as User;

    const leaveRequestsResponse = await authenticatedApiRequest(
        context,
        `api/leave-requests/status/${user.id}`
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

    return { leaveRequests, user };
}

export async function action({ request, context }: Route.ActionArgs) {
    const formData = await request.formData();

    const requestId = Number(formData.get("requestId"));
    const reason = String(formData.get("reason"));

    if (!requestId || Number.isNaN(requestId)) {
        return {
            error: "Invalid leave request."
        };
    }

    if (!reason.trim()) {
        return { error: "Please Enter a valid reason." };
    }

    try {
        const response = await authenticatedApiRequest(
            context,
            "api/leave-requests",
            {
                method: "DELETE",
                body: {
                    leaveRequestId: requestId,
                    reason,
                },
            }
        );

        if (!response.ok) {
            return {
                success: false,
                error: "Failed to cancel request",
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

export default function MyRequests() {

    const { leaveRequests } = useLoaderData<typeof loader>();
    const requestSuccess = useSearchParams()[0].has("success");

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [reason, setReason] = useState("");
    const [cancelError, setError] = useState("");

    const cancelRequestFetcher = useFetcher<{
        success?: boolean;
        error?: string;
    }>();

    useEffect(() => {
        if (cancelRequestFetcher.data?.success) {
            setShowCancelModal(false);
            setReason("");
            setSelectedRequestId(null);
        }
        if (cancelRequestFetcher.data?.error) {
            setError(cancelRequestFetcher.data.error);
        }
    }, [cancelRequestFetcher.data]);

    return <>
        <Navbar navBarTitle="My Requests" />
        <main className="min-h-screen pt-12 text-Bgen-Navy-500">
            <div
                className="
                max-w-xs
                md:max-w-3xl
                lg:max-w-5xl
                mx-auto
                border
                rounded-xl
                p-6"
            >

                {requestSuccess && (
                    <div className="mb-6 rounded-md bg-Bgen-LightGreen-100 p-4 border border-Bgen-LightGreen-300">
                        <p className="text-sm font-bold text-center text-Bgen-Green-500">Leave Request Submitted</p>
                    </div>
                )}

                <h1 className="text-2xl md:text-3xl font-bold text-center whitespace-nowrap pb-3 md:pb-5">
                    My Requests
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
                            select-none"
                        >
                            <h2 className="text-xl font-bold text-Bgen-Navy-500 mb-4">
                                Request #{request.id}
                            </h2>

                            <div className="space-y-2">
                                <p><strong>Start Date:<br /></strong> {request.startDate}</p>
                                <p><strong>End Date:<br /></strong> {request.endDate}</p>
                                <p><strong>Status:<br /></strong> {request.status}</p>
                                <p className="wrap-break-word"><strong>Reason:<br /></strong> {request.reason}</p>
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
                                            setError("");
                                            setShowCancelModal(true);
                                        }}>
                                        Cancel
                                    </button>)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>

        {showCancelModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-Bgen-Navy-300/50">
                <div className="bg-Bgen-Blue-100 rounded-lg p-6 w-96">
                    <h2 className="text-xl font-bold mb-4">
                        Cancel Request
                    </h2>

                    {cancelError && (
                        <div className="mb-4 rounded-md bg-Bgen-Orange-100 p-4 border border-Bgen-Orange-300">
                            <p className="text-sm font-bold text-Bgen-Orange-500">
                                {cancelError}
                            </p>
                        </div>
                    )}

                    <label>
                        Reason
                        <textarea
                            id="reason"
                            autoFocus
                            name="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border rounded p-2 mt-1"
                        />
                    </label>

                    <cancelRequestFetcher.Form method="post">
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
                                    setShowCancelModal(false);
                                    setReason("");
                                }}
                            >
                                Close
                            </button>

                            <button
                                tabIndex={0}
                                type="submit"
                                disabled={cancelRequestFetcher.state === "submitting"}
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
                                {cancelRequestFetcher.state === "submitting" ? "Cancelling..." : "Confirm"}
                            </button>
                        </div>
                    </cancelRequestFetcher.Form>
                </div>
            </div>
        )}
    </>
}