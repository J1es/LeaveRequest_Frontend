import type { Route } from "./+types/dashboard";
import PasswordInput from "~/components/PasswordInput";
import companyLogo from "../Assets/Logo/BGEN_PRIMARY_LOGO_BLUE_COLOUR_ICON.png"

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Login" },
        { name: "description", content: "Welcome Please Sign In" },
    ];
}

export default function Login() {


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

                <form className="flex flex-col items-center gap-4 w-full">
                    <input
                        type="text"
                        placeholder="Email"
                        className="w-[90vw] max-w-md px-4 py-2 border rounded-lg text-start"
                    />
                    <PasswordInput className="w-[90vw] max-w-md"></PasswordInput>
                    <button
                        tabIndex={0}
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
                        Login
                    </button>
                </form>
            </div>
        </main>
    </>
}
