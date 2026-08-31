import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { sessionStorage } from "../libs/auth";

export async function loader({ request }: LoaderFunctionArgs) {
    return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        throw new Response("Method Not Allowed", { status: 405 });
    }

    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    return redirect("/login", {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
        },
    });
}

export default function Logout() {
    return null;
}