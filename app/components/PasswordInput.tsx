import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
    className?: string;
    inputName?: string;
    isDisabled?: boolean;
}

export default function PasswordInput({
className = "",
inputName = "",
isDisabled = false
}: PasswordInputProps) {

    const [isHidden, toggleHide] = useState(true)

    return <>
        <div className={"relative " + className}>
            <input
                type={isHidden ? "password" : "text"}
                name={inputName} 
                disabled={isDisabled}
                required
                placeholder="************"
                className="w-full px-4 py-2 border rounded-lg text-front"
            />
            <button
                type={"button"}
                disabled={isDisabled}
                onClick={() => toggleHide((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                transition-transform duration-200 hover:scale-110 active:scale-90 cursor-pointer"
                aria-label={isHidden ? "Show password" : "Hide password"}
                title={isHidden ? "Show password" : "Hide password"}>
                {isHidden ? <Eye size={32} /> : <EyeOff size={32}/>}
            </button>
        </div>
    </>
}