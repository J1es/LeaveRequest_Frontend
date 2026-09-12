import { Link, redirect, useFetcher, useLoaderData, useSearchParams } from "react-router";
import { authMiddleware, authContext, type User } from "~/libs/auth";
import type { Route } from "./+types/adminactions";
import Navbar from "~/components/NavBar";
import { authenticatedApiRequest } from "~/libs/api";
import type { Employee } from "~/types/Employee";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Admin Actions" },
        { name: "admin actions", content: "Admin Actions" },
    ];
}

export async function loader({ context }: Route.LoaderArgs) {
    const user = context.get(authContext) as User;

    if (user.role !== "admin") {
        return redirect("/");
    }

    const getStaffResponse = await authenticatedApiRequest(
        context,
        `/api/users`
    )

    const response = await getStaffResponse.json();

    const staff = (response.data as Employee[])

    return { staff };
}

export async function action({ request, context }: Route.ActionArgs) {
    const formData = await request.formData();

    const employeeId = Number(formData.get("employeeId"));
    const leaveBalance = Number(formData.get("leaveBalance"));
    const roleId = Number(formData.get("roleId"));

    if (!employeeId || Number.isNaN(employeeId)) {
        return {
            error: "Invalid employee ID."
        };
    }

    if (Number.isNaN(leaveBalance)) {
        return {
            error: "Please enter a valid leave balance."
        };
    }

    if (Number.isNaN(roleId)) {
        return {
            error: "Please enter a valid role."
        };
    }

    try {

        const editResponse = await authenticatedApiRequest(
            context,
            `api/users/${employeeId}`,
            {
                method: "PATCH",
                body: {
                    leaveBalance,
                    roleId
                },
            }
        );

        if (!editResponse.ok) {
            return {
                success: false,
                error: "Failed to Edit User",
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

export default function AdminActions() {

    const { staff } = useLoaderData<typeof loader>();
    const requestSuccess = useSearchParams()[0].has("success");
    
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const [leaveBalance, setLeaveBalance] = useState("");
    const [role, setRole] = useState("");

    const manageActionRequestFetcher = useFetcher<{
        success?: boolean;
        error?: string;
    }>();

    useEffect(() => {
        if (manageActionRequestFetcher.data?.success) {
            setShowEditUserModal(false);
            setSelectedEmployee(null);
            setLeaveBalance("");
            setRole("");
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
                p-6"
            >

                {requestSuccess && (
                    <div className="mb-6 rounded-md bg-Bgen-LightGreen-100 p-4 border border-Bgen-LightGreen-300">
                        <p className="text-sm font-bold text-center text-Bgen-Green-500">User Created</p>
                    </div>
                )}

                <h1 className="text-2xl font-bold text-center whitespace-nowrap pb-3 md:pb-5">
                    Staff
                </h1>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                    <Link
                        to="/adminactions/adduser"
                        className="
                        w-64
                        md:w-72
                        min-h-65
                        border-2
                        border-dashed
                        border-Bgen-Green-400
                        rounded-xl
                        p-6
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-center
                        hover:bg-Bgen-Green-100
                        transition-all
                        "
                    >
                        <div className="text-5xl font-bold mb-2">+</div>

                        <h2 className="text-xl font-bold">
                            Add New User
                        </h2>

                    </Link>
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
                                    <h3><strong>Role:</strong></h3>
                                    <p>{employee.role.name}</p>
                                </div>
                                <div>
                                    <h3><strong>Leave Balance:</strong></h3>
                                    <p>{employee.leaveBalance} days</p>
                                </div>
                                <button
                                    type="button"
                                    className="
                                    block
                                    w-45
                                    p-1
                                    mx-auto
                                    text-center
                                    font-medium
                                    bg-Bgen-Orange-400
                                    rounded-lg
                                    shadow-md
                                    cursor-pointer"
                                    onClick={() => {
                                        setSelectedEmployee(employee);
                                        setLeaveBalance(employee.leaveBalance.toString());
                                        setRole(employee.role.id.toString());
                                        setShowEditUserModal(true);
                                    }}
                                >
                                    Edit User
                                </button>
                                <Link
                                    to={`/adminactions/${employee.id}`}
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

        {showEditUserModal && selectedEmployee && (
            <div className="fixed inset-0 flex items-center justify-center bg-Bgen-Navy-300/50">
                <div className="bg-Bgen-Blue-100 rounded-lg p-6 w-96">
                    <h2 className="text-xl font-bold mb-4">
                        Edit User
                    </h2>

                    <div className="space-y-4">

                        <div>
                            <label className="font-medium">
                                Leave Balance
                                <input
                                    type="number"
                                    value={leaveBalance}
                                    onChange={(e) =>
                                        setLeaveBalance(e.target.value)
                                    }
                                    className="w-full border rounded p-2 mt-1"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="font-medium">
                                Role
                                <select
                                    value={role}
                                    onChange={(e) =>
                                        setRole(e.target.value)
                                    }
                                    className="w-full border rounded p-2 mt-1"
                                >
                                    <option value="1">Manager</option>
                                    <option value="2">Admin</option>
                                    <option value="3">Staff</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <manageActionRequestFetcher.Form method="post">

                        <input
                            type="hidden"
                            name="employeeId"
                            value={selectedEmployee.id}
                        />

                        <input
                            type="hidden"
                            name="leaveBalance"
                            value={leaveBalance}
                        />

                        <input
                            type="hidden"
                            name="roleId"
                            value={role}
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
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
                                    setShowEditUserModal(false);
                                    setSelectedEmployee(null);
                                }}
                            >
                                Close
                            </button>

                            <button
                                type="submit"
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
                            cursor-pointer">
                                Save
                            </button>
                        </div>
                    </manageActionRequestFetcher.Form>
                </div>
            </div >
        )
        }

    </>
}
