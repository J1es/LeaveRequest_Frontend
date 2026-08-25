import { Link, useNavigate } from "react-router";
import { House, LogOut } from "lucide-react";

interface NavBarProps {
    navBarTitle?: string;
}

export default function Navbar({
    navBarTitle = ""
}: NavBarProps) {

    const navigate = useNavigate();

    return <>
        <nav className="h-[10vh] flex items-center justify-between bg-white shadow-md px-8">
            <h1 className="text-zinc-950 text-4xl font-bold">{navBarTitle}</h1>

            <div className="flex items-center gap-8">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-zinc-950 hover:text-amber-600 transition-colors
                    duration-200 hover:scale-105 active:scale-95"
                >
                    <span>Home</span>
                    <House />
                </Link>

                <button className="flex 
                p-2 
                items-center 
                gap-2 
                border-2 
                rounded-lg 
                text-zinc-950 
                hover:text-amber-600
                0 transition-colors
                hover:scale-105 active:scale-95" 
                onClick={() => navigate("/login")}>
                    
                    <span>Sign Out</span>
                    <LogOut />
                </button>
            </div>
        </nav>
    </>
}