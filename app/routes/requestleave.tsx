import {useActionData, Form, useNavigation, redirect} from "react-router";
import { authMiddleware} from "~/libs/auth";
import type { Route } from "./+types/requestleave";
import Navbar from "~/components/NavBar";
import { authenticatedApiRequest } from "~/libs/api";
import companyLogo from "../Assets/Logo/BGEN_PRIMARY_LOGO_BLUE_COLOUR_ICON.png"

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Request Leave" },
        { name: "request leave", content: "Leave Request Form" },
    ];
}

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];

export async function action({ request, context }: Route.ActionArgs) {
    const formData = await request.formData();
    const startDate = formData.get("startdate");
    const endDate = formData.get("enddate");

    if (!startDate || !endDate) {
        return { error: "Start date and End date are required" };
    }

    try {
        const createResponse = await authenticatedApiRequest(
            context,
            "api/leave-requests",
            {
                method: "POST",
                body: { startDate, endDate },
            }
        );

        if (!createResponse.ok) {
            const errorData = await createResponse.json().catch(() => ({}));
            return {
                error: errorData.error?.message || `Failed to Request Leave (Status: ${createResponse.status})`
            };
        }

        return redirect(`/myrequests?success=true`);

    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "An unexpected error occurred"
        };
    }

}

export default function RequestLeave() {
    const actionData = useActionData() as { error?: string } | undefined;
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    return <>
        <Navbar navBarTitle="Request Leave" />
        <main className="relative h-screen text-Bgen-Navy-500">
            <div className="absolute 
            left-1/2 top-1/3 
            p-4
            border 
            rounded-xl
            -translate-x-1/2 -translate-y-1/2 
            flex flex-col 
            items-center 
            gap-6">
                <div className="flex items-center gap-4">
                    <img
                        src={companyLogo}
                        alt="Company Logo"
                        className="h-8 relative -top-1.5 md:-top-2.5" />

                    <h1 className="text-xl md:text-3xl font-bold text-center whitespace-nowrap pb-3 md:pb-5">
                        Leave Request Form
                    </h1></div>

                {actionData?.error && (
                    <div className="mb-6 rounded-md bg-Bgen-Orange-100 p-4 border border-Bgen-Orange-300">
                        <p className="text-sm font-bold text-Bgen-Orange-500">{actionData.error}</p>
                    </div>
                )}


                <Form method="post" className="flex flex-col items-center gap-12 w-full text-xl">

                    <div className="flex flex-col md:flex-row gap-3">
                        <label className="flex flex-col items-center">Start Date
                            <input
                                type="date"
                                name="startdate"
                                defaultValue={new Date().toISOString().split("T")[0]}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </label>

                        <h2 className="hidden md:inline">:</h2>

                        <label className="flex flex-col items-center">End Date
                            <input
                                type="date"
                                name="enddate"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </label>
                    </div>

                    <button
                        tabIndex={0}
                        disabled={isSubmitting}
                        type="submit"
                        className="w-60 p-3
                        font-medium 
                        bg-Bgen-Yellow-500 
                        rounded-lg
                        shadow-md
                        hover:-translate-y-0.5
                        hover:shadow-lg
                        active:translate-y-1
                        transition-all 
                        duration-60
                        cursor-pointer">
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </Form>
            </div>
        </main>
    </>
}