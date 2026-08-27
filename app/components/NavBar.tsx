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
        <nav className="h-20 flex items-center justify-between bg-Bgen-Sand-200 shadow-md px-8">
            <h1 className="text-Bgen-Navy-500 text-4xl font-bold shrink-0">{navBarTitle}</h1>

            <div className="flex items-center gap-8">
                <Link
                    tabIndex={0}
                    to="/"
                    className="flex items-center gap-2 text-Bgen-Navy-500 hover:text-Bgen-Teal-500 transition-all
                    duration-200 hover:scale-105 active:scale-95"
                >
                    <span>Home</span>
                    <House />
                </Link>

                <button 
                tabIndex={0}
                className="flex 
                p-2 
                items-center 
                gap-2 
                border-2 
                rounded-lg 
                text-Bgen-Navy-500 
                hover:text-Bgen-Teal-500
                0 transition-all
                hover:scale-105 active:scale-95
                cursor-pointer" 
                onClick={() => navigate("/login")}>
                    
                    <span line-clamp-1>Sign Out</span>
                    <LogOut />
                </button>
            </div>
        </nav>
    </>
}