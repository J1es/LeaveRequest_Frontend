import { Link, useLoaderData } from "react-router";
import { authMiddleware, authContext, type User } from "~/libs/auth";
import type { Route } from "./+types/dashboard";
import Navbar from "~/components/NavBar";
import { ShieldUser, TentTree, PencilLine, FileUser } from "lucide-react";
import { authenticatedApiRequest } from "~/libs/api";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard" },
        { name: "description", content: "Leave Request Dashboard" },
    ];
}

export async function loader({ context }: Route.LoaderArgs) {
    const user = context.get(authContext) as User;

    const leaveBalanceResponse = await authenticatedApiRequest(
        context,
        `api/leave-requests/remaining/${user.id}`
    );

    if (!leaveBalanceResponse.ok) {
        throw new Response(
            "Failed to fetch remaining leave balance",
            { status: leaveBalanceResponse.status }
        );
    }

    const response = await leaveBalanceResponse.json();
    const leaveBalance = response.data.data["days remaining"];

    return { leaveBalance, user };
}

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];

function Cards() {
    const items = [
        {
            id: 1, title: "Request Leave",
            icon: PencilLine,
            roles: ["staff", "manager", "admin"],
        },
        {
            id: 2, title: "My Requests",
            icon: TentTree,
            roles: ["staff", "manager", "admin"],
        },
        {
            id: 3, title: "Manager Actions",
            icon: FileUser,
            roles: ["manager"],
        },
        {
            id: 4,
            title: "Admin Actions",
            icon: ShieldUser,
            roles: ["admin"],

        },
    ];
    return items;
}

export default function Dashboard() {
    const { leaveBalance, user } = useLoaderData<typeof loader>();
    const cards = Cards().filter((card) => card.roles.includes(user?.role ?? ""));
    return <>
        <div className="space-y-6">
            <Navbar navBarTitle="Dashboard" />

            <div className="w-72 rounded-xl border border-Bgen-Navy-500 bg-Bgen-SkyBlue-200 p-6 shadow mx-auto">
                <p className="text-center text-lg font-bold text-Bgen-Navy-500 uppercase tracking-wide">
                    Leave Balance
                </p>

                <div className="mt-3 flex justify-center items-baseline">
                    <span className="text-7xl font-bold text-Bgen-Navy-500">{leaveBalance}</span>
                    <span className="ml-2 text-2xl text-Bgen-Navy-500">days</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:justify-center gap-6">
                {cards.map((card) => (
                    <Link
                        key={card.id}
                        to={`/card/${card.id}`}
                        className="
                        group
                        flex
                        flex-col
                        items-center
                        justify-center
                        w-48 h-48
                        rounded-xl
                        bg-linear-to-br
                        from-Bgen-SkyBlue-100
                        to-Bgen-SkyBlue-300
                        shadow-lg
                        transition-all
                        duration-200
                        hover:-translate-y-2
                        hover:shadow-2xl
                        active:scale-95"
                    >
                        <h3 className="text-center
                        text-lg
                        font-semibold
                        transition-all
                        duration-100
                        group-hover:text-Bgen-Teal-500
                        group-hover:scale-115">{card.title}</h3>

                        <card.icon
                            size={48}
                            className="
                            mt-4
                            text-Bgen-Navy-500
                            transition-all
                            duration-100
                            group-hover:text-Bgen-Teal-500
                            group-hover:scale-115"
                        />
                    </Link>
                ))}
            </div>
        </div>
    </>
}
