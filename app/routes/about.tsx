import { useState, useEffect } from "react";
import type { Route } from "./+types/home";
import Button from "../components/Button";
import PasswordInput from "~/components/PasswordInput";
import Navbar from "~/components/NavBar";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function About() {
    const [now, setNow] = useState(new Date());
    const [count, setCount] = useState(0);
    const [rand] = useState(Math.round(Math.random() * 100));

    const updateDate = () => {
        setNow(new Date());
    }

    // https://www.youtube.com/watch?v=RY_2gElt3SA
    // https://css-tricks.com/snippets/css/a-guide-to-flexbox

    const increment = () => {
        setCount((prev) => prev + 1);
    }

    /*
    "you just run setCount with" (current) => current + 1
    "ok, that's a function, so i'll run it"
    (current) => current + 1
     ^ it's currently 2
    2 => 2 + 1, = 3
    so i'll set it to 3
    */

    useEffect(() => {
        const interval = setInterval(() => {
            updateDate();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // useEffect(() => {
    //     alert(`The count is now ${count}`);
    // }, [count]);

    return <>
        <Navbar navBarTitle="Leave Requests"/>

        <p>Hello, it is {now.toLocaleString()}</p>
        <p>The random number is {rand}</p>
        <div className="flex flex-row gap-2 bg-purple-900 w-full justify-evenly">
            <Button onClick={updateDate}>Update Date</Button>
            <Button onClick={increment}>Increment the count!</Button>
        </div>
        <p>The count is {count}</p>

        <PasswordInput className="w-[90vw] max-w-md"></PasswordInput>

    </>
}
