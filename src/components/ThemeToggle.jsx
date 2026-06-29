"use client";

import { useEffect, useState } from "react";
import { Switch } from "@heroui/react";
import { Moon, Sun } from "@gravity-ui/icons";

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") return "light";
        return localStorage.getItem("theme") === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const handleToggle = (isSelected) => {
        setTheme(isSelected ? "dark" : "light");
    };

    return (
        <Switch.Root
            isSelected={theme === "dark"}
            onChange={handleToggle}
            aria-label="Toggle dark mode"
            size="sm"
            className="m-0"
        >
            {({ isSelected }) => (
                <Switch.Content className="cursor-pointer">
                    <Switch.Control className="relative h-8 w-16 rounded-full border border-slate-200 bg-slate-100 px-1 transition data-[selected]:border-[#C9A646] data-[selected]:bg-[#1E3A5F]">
                        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#C9A646]">
                            <Sun className="h-4 w-4" />
                        </span>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                            <Moon className="h-4 w-4" />
                        </span>
                        <Switch.Thumb className={`absolute top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#1E3A5F] shadow-sm transition ${isSelected ? "translate-x-8" : "translate-x-0"}`}>
                            {isSelected ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                        </Switch.Thumb>
                    </Switch.Control>
                </Switch.Content>
            )}
        </Switch.Root>
    );
};

export default ThemeToggle;
