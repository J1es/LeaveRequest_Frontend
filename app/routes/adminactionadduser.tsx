import { useActionData, Form, useNavigation, redirect } from "react-router";
import { authContext, authMiddleware, type User } from "~/libs/auth";
import type { Route } from "./+types/adminactionadduser";
import Navbar from "~/components/NavBar";
import { authenticatedApiRequest } from "~/libs/api";
import companyLogo from "../Assets/Logo/BGEN_PRIMARY_LOGO_BLUE_COLOUR_ICON.png"

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Add User" },
        { name: "Add User Form", content: "Add a New User" },
    ];
}

export async function loader({ context }: Route.LoaderArgs) {
    const user = context.get(authContext) as User;

    if (user.role !== "admin") {
        throw redirect("/");
    }

}

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];

export async function action({ request, context }: Route.ActionArgs) {
    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const surname = formData.get("surname");
    const email = formData.get("email");
    const password = formData.get("password");
    const roleId = Number(formData.get("roleId"));

    if (!firstName) {
        return { error: "First Name is Required" };
    }
    if (!surname) {
        return { error: "Surname is Required" };
    }
    if (!email) {
        return { error: "Email is Required" };
    }
    if (!password) {
        return { error: "Password is Required" };
    }
    if (Number.isNaN(roleId)) {
        return { error: "Role is Required" };
    }
    try {
        const createResponse = await authenticatedApiRequest(
            context,
            "api/users",
            {
                method: "POST",
                body: {
                    firstName,
                    surname,
                    email,
                    password,
                    roleId
                },
            }
        );

        if (!createResponse.ok) {
            const errorData = await createResponse.json().catch(() => ({}));
            return {
                error: errorData.error?.message || `Failed to Create User (Status: ${createResponse.status})`
            };
        }

        return redirect(`/adminactions?success=true`);

    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "An unexpected error occurred"
        };
    }

}

export default function AdminActionAddUser() {
    const actionData = useActionData() as
        { error?: string } | undefined;

    const navigation = useNavigation();

    const isSubmitting =
        navigation.state === "submitting";

    return <>
        <Navbar navBarTitle="Add User" />

        <main className="relative min-h-screen text-Bgen-Navy-500">

            <div className="absolute 
            left-1/2 top-[40%]
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
                        Add New User
                    </h1></div>

                {actionData?.error && (
                    <div className="mb-6 rounded-md bg-Bgen-Orange-100 p-4 border border-Bgen-Orange-300">
                        <p className="text-sm font-bold text-Bgen-Orange-500">{actionData.error}</p>
                    </div>
                )}

                <Form method="post" className="flex flex-col items-center gap-12 w-full text-xl">

                    <div className="flex flex-col gap-3">
                        <label className="flex flex-col items-center">First Name
                            <input
                                type="text"
                                name="firstName"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </label>

                        <label className="flex flex-col items-center">Surname
                            <input
                                type="text"
                                name="surname"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </label>

                        <label className="flex flex-col items-center">Email
                            <input
                                type="email"
                                name="email"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </label>

                        <label className="flex flex-col items-center">Password
                            <input
                                type="text"
                                name="password"
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </label>

                        <label className="flex flex-col items-center">
                            Role
                            <select
                                name="roleId"
                                className="
                                w-full
                                px-4
                                py-2
                                border
                                rounded-lg"
                            >
                                <option value="1">
                                    Manager
                                </option>

                                <option value="2">
                                    Admin
                                </option>

                                <option value="3">
                                    Staff
                                </option>
                            </select>
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
    </>;
}