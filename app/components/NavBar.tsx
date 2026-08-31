import { Form, Link, useNavigate } from "react-router";
import { House, LogOut } from "lucide-react";

interface NavBarProps {
    navBarTitle?: string;
}

export default function Navbar({
    navBarTitle = ""
}: NavBarProps) {

    const navigate = useNavigate();

    return <>
        <nav className="flex flex-col md:flex-row items-center justify-between gap-4 px-8 py-4 bg-Bgen-Sand-200 shadow-md">
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

                <Form action="/logout" method="post">
                    <button
                        tabIndex={0}
                        type="submit"
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
                        cursor-pointer">
                        <span className="line-clamp-1">Sign Out</span>
                        <LogOut />
                    </button>
                </Form>
            </div>
        </nav>
    </>
}