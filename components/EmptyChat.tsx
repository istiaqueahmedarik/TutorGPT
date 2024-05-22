'use client'
import React from 'react'


function EmptyChat() {
    return (
        <div className="bg-[#1D1D1D] min-h-screen flex flex-col items-center justify-center">

            <main className="grid grid-cols-2 gap-8">
                <div className="rounded-lg border shadow-sm bg-[#161b22] text-white" >
                    <div className="flex items-center space-x-4 p-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="text-[#f1c40f] h-6 w-6"
                        >
                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                            <path d="M9 18h6"></path>
                            <path d="M10 22h4"></path>
                        </svg>
                        <span>Choose Teacher</span>
                    </div>
                </div>
                <div className="rounded-lg border shadow-sm bg-[#161b22] text-white" >
                    <div className="flex items-center space-x-4 p-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="text-[#2ecc71] h-6 w-6"
                        >
                            <path d="M6 18h8"></path>
                            <path d="M3 22h18"></path>
                            <path d="M14 22a7 7 0 1 0 0-14h-1"></path>
                            <path d="M9 14h2"></path>
                            <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path>
                            <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path>
                        </svg>
                        <span>Create Diagram</span>
                    </div>
                </div>


            </main>


        </div>
    )
}

export default EmptyChat