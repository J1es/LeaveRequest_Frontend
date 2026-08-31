import { Form, redirect, useActionData, useNavigation, useSearchParams, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/login";
import PasswordInput from "~/components/PasswordInput";
import { getUserFromRequest, loginWithCredentials, startSession } from "~/libs/auth";
import { ensureRelativeUrl } from "~/libs/url";
import companyLogo from "../Assets/Logo/BGEN_PRIMARY_LOGO_BLUE_COLOUR_ICON.png"

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Login" },
        { name: "description", content: "Welcome Please Sign In" },
    ];
}

export async function loader({ request }: LoaderFunctionArgs) {
    const { user } = await getUserFromRequest(request);
    if (user) {
        return redirect("/");
    }

    return null;
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const redirectTo = ensureRelativeUrl(formData.get("redirectTo")?.toString() || "", "/");
    console.log("redirectTo:", formData.get("redirectTo"));
    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    try {
        const { token } = await loginWithCredentials(email, password);
        const { sessionCookie } = await startSession(request, token);

        return redirect(ensureRelativeUrl(redirectTo, "/"), {
            headers: {
                "Set-Cookie": sessionCookie,
            },
        });
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Invalid credentials",
        };
    }
}

export default function Login() {
    const actionData = useActionData() as { error?: string } | undefined;
    const navigation = useNavigation();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "/";
    const isSubmitting = navigation.state === "submitting";

    return <>
        <main className="relative h-screen text-Bgen-Navy-500">
            <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">

                <div className="flex items-center gap-4">
                    <img
                        src={companyLogo}
                        alt="Company Logo"
                        className="h-6 md:h-12 relative -top-1.5 md:-top-2.5" />

                    <h1 className="text-3xl md:text-5xl font-bold text-center whitespace-nowrap pb-3 md:pb-5">
                        Leave Request System
                    </h1></div>

                <h2 className="text-3xl font-bold text-center whitespace-nowrap">
                    Welcome, <br /> Please Sign In
                </h2>

                {actionData?.error && (
                    <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
                        <p className="text-sm text-red-700">{actionData.error}</p>
                    </div>
                )}

                <Form method="post" className="flex flex-col items-center gap-4 w-full">
                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <input
                        type="text"
                        name="email"
                        disabled={isSubmitting}
                        required
                        placeholder="Email"
                        className="w-[90vw] max-w-md px-4 py-2 border rounded-lg text-start"
                    />
                    <PasswordInput
                        inputName="password"
                        isDisabled={isSubmitting}
                        className="w-[90vw] max-w-md"
                    />
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
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>
                </Form>
            </div>
        </main>
    </>
}
