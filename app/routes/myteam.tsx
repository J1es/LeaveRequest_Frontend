import { Link, redirect, useLoaderData } from "react-router";
import { authMiddleware, authContext, type User } from "~/libs/auth";
import type { Route } from "./+types/myteam";
import Navbar from "~/components/NavBar";
import { authenticatedApiRequest } from "~/libs/api";
import type { ManagementRecord } from "~/types/ManagementRecord";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "My Team" },
        { name: "my team", content: "List of Managers Team Members" },
    ];
}

export async function loader({ context }: Route.LoaderArgs) {
    const user = context.get(authContext) as User;

    if (user.role !== "manager") {
        return redirect("/");
    }

    const staffManagementResponse = await authenticatedApiRequest(
        context,
        `api/user-management`
    )

    const response = await staffManagementResponse.json();

    const staff = (response.data as ManagementRecord[])
        .filter((item) => item.manager.id === user.id)
        .map((item) => item.user);

    return { staff };
}

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];

export default function MyTeam() {

    const { staff } = useLoaderData<typeof loader>();

    return <>
        <Navbar navBarTitle="My Team" />
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

                <h1 className="text-2xl md:text-3xl font-bold text-center whitespace-nowrap pb-3 md:pb-5">
                    Staff
                </h1>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                    {staff.map((employee) => (
                        <div
                            key={employee.id}
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
                                Employee ID: {employee.id}
                            </h2>

                            <div className="space-y-2">
                                <div>
                                    <h3><strong>Name:</strong></h3>
                                    <p> {employee.firstName} {employee.surname}</p>
                                </div>
                                <div>
                                    <h3><strong>Email:</strong></h3>
                                    <p>{employee.email}</p>
                                </div>
                                <div>
                                    <h3><strong>Leave Balance:</strong></h3>
                                    <p>{employee.leaveBalance} days</p>
                                </div>
                                <Link
                                    to={`/myteam/${employee.id}`}
                                    className="
                                    block
                                    w-45
                                    p-1
                                    mx-auto
                                    text-center
                                    font-medium
                                    bg-Bgen-Green-400
                                    rounded-lg
                                    shadow-md
                                    ">
                                    Manage Requests
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    </>
}
