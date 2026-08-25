import PasswordInput from "~/components/PasswordInput";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Login" },
        { name: "description", content: "Welcome Please Sign In" },
    ];
}

export default function Login() {


    return <>
        <main className="relative h-screen text-zinc-950">
            <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-15">

                <h1 className="text-3xl font-bold text-center whitespace-nowrap">
                    Welcome, <br /> Please Sign In
                </h1>

                <form className="flex flex-col items-center gap-4 w-full">
                    <input
                        type="text"
                        placeholder="Email"
                        className="w-[90vw] max-w-md px-4 py-2 border rounded-lg text-center"
                    />
                    <PasswordInput className="w-[90vw] max-w-md"></PasswordInput>
                    <button 
                    className="w-60 p-3
                    font-medium 
                    bg-amber-600 
                    rounded-lg
                    shadow-md
                    hover:-translate-y-0.5
                    hover:shadow-lg
                    active:translate-y-1
                    transition-all 
                    duration-60">
                        Login
                    </button>
                </form>
            </div>
        </main>
    </>
}
