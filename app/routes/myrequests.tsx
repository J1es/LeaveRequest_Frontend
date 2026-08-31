import { Link, useLoaderData } from "react-router";
import { authMiddleware, authContext, type User } from "~/libs/auth";
import type { Route } from "./+types/myrequests";
import Navbar from "~/components/NavBar";
import { authenticatedApiRequest } from "~/libs/api";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "My Requests" },
        { name: "my requests", content: "my requests" },
    ];
}

export async function loader({ context }: Route.LoaderArgs) {
    const user = context.get(authContext) as User;

    return { user };
}

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];

export default function Dashboard() {

    return <>
        <Navbar navBarTitle="My Requests" />
    </>
}
