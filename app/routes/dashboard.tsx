import type { Route } from "./+types/dashboard";
import Navbar from "~/components/NavBar";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Dashboard" },
        { name: "description", content: "Leave Request Dashboard" },
    ];
}

export default function Dashboard() {

    return <>
        <Navbar navBarTitle="Dashboard"/>


    </>
}
