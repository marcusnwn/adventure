import React from 'react';


interface MainContainerProps {
    children: React.ReactNode;
}

export function MainContainer({ children }: MainContainerProps) {
    return (
        <div className="w-full h-screen flex justify-center items-center bg-zinc-900">
            <div className="relative w-full max-w-md h-full bg-anime-bg flex flex-col shadow-2xl overflow-hidden">
                {children}
            </div>
        </div>
    );
}
