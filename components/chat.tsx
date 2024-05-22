'use client'
import { continueConversation, continueConversationImage, systemDesc } from '@/app/actions';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { readStreamableValue } from 'ai/rsc';
import { ArrowBigRightDash, CircleX, User, X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { set } from 'zod';
import { Mermaid, MermaidProps } from './mermaid';
import EmptyChat from './EmptyChat';
type Content = {
    type: 'text' | 'mermaid' | 'image';
    text?: string;
    image?: string;
};

type Message = {
    role: 'user' | 'assistant';
    content: Content[];
};

export default function Chat() {
    const [subject, setSubject] = useState('');
    const [imageData, setImageData] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>("");
    const [conversation, setConversation] = useState<Message[]>([]);

    const [input, setInput] = useState<string>('');
    const generateAdditionalInfo = (subject: string) => {
        const additionalInfo = `
        Every response should have a mermaid js markdown diagram, and the diagram should be related to the topic, and the diagram should be explained in the response.
         You are an expert on ${subject} .now you will be given topic name or some passage or some image, your response will be explaining everyhing on the topic or passage or the image, now when explaining do not miss anything from passage or image, and before explaining anyhing from the passage or the image, mention it like, 'now i will explain this: in the passage this is what we see' something like that, now your response should be like a university professor, if possible add example to remember concept.
         
    `;
        return additionalInfo;
    }

    useEffect(() => {
        async function fetchData() {
            const storedSubject = localStorage.getItem('subject') || 'Math';
            const aidesc = localStorage.getItem('aidesc') || generateAdditionalInfo(storedSubject);
            localStorage.setItem('aidesc', aidesc);
            localStorage.setItem('subject', storedSubject);
            setSubject(storedSubject);
        }
        fetchData();
    }, []);

    const [processed, setProcessed] = useState(false);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('file change');
        const file = event.target.files?.[0]; // Add null check for event.target.files
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageData(reader.result as string);
        };


        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImageData(null);
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    function removeMarkdown(input: string) {
        const markdownRegex = /(\*{1,2}|_{1,2}|`{1,3}|\~{2}|#{1,6}|\!?\[.*?\]\(.*?\))/g;
        return input.replace(markdownRegex, '');
    }
    const handleSend = async () => {
        setProcessed(true);
        localStorage.setItem("aidesc", generateAdditionalInfo(subject));
        localStorage.setItem("subject", subject);
        setProcessed(false);
    }
    return (
        <div className="flex flex-col h-full w-[70%] justify-around bg-[#1d1d1d] rounded-lg p-4 ">
            <header className="flex items-center justify-between p-4 border-b border-[#B9B3A9]">
                <h1 className="text-2xl font-bold text-[#B9B3A9]">TutorGPT</h1>
                <div className='flex flex-col md:flex-row'>
                    <div className='mb-2 md:mb-0 md:mr-2'>
                        <span> I want a </span>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="outline-none bg-transparent border-b border-[#B9B3A9] text-[#B9B3A9] w-20 text-center"
                        />
                        <span> Tutor </span>
                    </div>
                    <div className='cursor-pointer hover:text-blue-400'>
                        <ArrowBigRightDash onClick={handleSend} />
                    </div>
                </div>
            </header>
            {conversation.length === 0 && <EmptyChat />}
            <main className="flex-1 flex flex-col m-2">
                {conversation.map((message, index) => (
                    <div key={index}>
                        {
                            message.content.map((content, index) => {
                                if (content.type === 'text') {
                                    return (
                                        <p key={index} className={message.role === 'user' ? 'flex flex-row  w-fit pt-2 pb-2 pl-5 pr-5 rounded-md float-right' : ''}>
                                            <span className='border-1 rounded-full mr-2'>{message.role === 'user' && <User />}</span> <Markdown>{content.text}</Markdown>
                                        </p>
                                    )
                                }
                                if (content.type === 'mermaid') {
                                    const mermaidProps: MermaidProps = {
                                        text: content.text
                                    };
                                    return (
                                        <div key={index} className="mt-4">
                                            <Mermaid {...mermaidProps} />
                                        </div>
                                    )
                                }
                                if (content.type === 'image') {
                                    return (
                                        <img key={index} src={`data:image/png;base64,${content.image}`} alt="Uploaded" className="mt-4 max-h-60" />
                                    )
                                }
                            })}

                    </div>
                ))}

            </main>
            <div className="flex w-full items-center">
                <div className="flex w-full flex-col gap-1.5 rounded-[26px] p-1.5 transition-colors dark:bg-token-main-surface-secondary bg-[#232628]">
                    <div className="flex items-end gap-1.5 md:gap-3.5 mt-auto mb-auto justify-center">
                        <div
                            className="mt-auto mb-auto"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls="radix-:rb:"
                            data-state="closed"
                        >
                            <div className="flex flex-1 justify-center">
                                <button
                                    className="flex items-center justify-center text-token-text-primary juice:h-8 juice:w-8 dark:text-white juice:rounded-full focus-visible:outline-black dark:focus-visible:outline-white juice:mb-1 juice:ml-[3px]"
                                    aria-label="Attach files"
                                    onClick={handleButtonClick}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={processed}

                                />
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                            {imageData && (
                                <div className='relative w-fit group'>
                                    <img src={imageData} alt="Uploaded" className="max-h-60 rounded-md" />
                                    <CircleX className='text-red-700 absolute top-0 right-0 w-[20px] h-[20px] cursor-pointer opacity-0 group-hover:opacity-100' onClick={clearImage}>Clear Image</CircleX>
                                </div>
                            )}
                            <textarea
                                disabled={processed}
                                id="prompt-textarea"
                                tabIndex="0"
                                data-id="root"
                                dir="auto"
                                rows="1"
                                placeholder="Message TutorGPT"
                                className="resize-none border-0 bg-transparent px-3 text-token-text-primary focus:ring-0 focus-visible:ring-0 max-h-52 h-[40px] mt-auto mb-auto py-2 overflow-y-hidden outline-none bg-[#232628]"
                                spellCheck="false"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            disabled={processed || !input}
                            onClick={async () => {
                                if (!input) {
                                    return;
                                }
                                const aidesc = localStorage.getItem('aidesc') || generateAdditionalInfo(subject);
                                setProcessed(true);
                                const { messages, newMessage } =
                                    imageData ? await continueConversationImage([
                                        ...conversation,
                                        {
                                            role: 'user', content:
                                                [
                                                    { type: 'text', text: input },
                                                    { type: 'image', image: imageData.split(',')[1] },
                                                ]
                                        },

                                    ]
                                        ,
                                        aidesc
                                    ) : await continueConversation([
                                        ...conversation,
                                        {
                                            role: 'user', content:
                                                [
                                                    { type: 'text', text: input },
                                                ]
                                        },

                                    ]
                                        ,
                                        aidesc
                                    )


                                let textContent = '';
                                let mermaidContent = '';
                                for await (const delta of readStreamableValue(newMessage)) {
                                    const obj = JSON.parse(delta);

                                    textContent = `${obj.text}`;
                                    mermaidContent = `${obj.mermaid}`;

                                    setConversation([
                                        ...messages,
                                        {
                                            role: 'assistant', content: [
                                                { type: 'text', text: textContent },
                                                { type: 'mermaid', text: removeMarkdown(mermaidContent) }

                                            ]
                                        },
                                    ]

                                    );
                                }

                                setInput('');
                                setProcessed(false);
                                setImageData(null);
                                setError("");


                            }}
                            data-testid="fruitjuice-send-button"
                            className="mb-1 mr-1 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:outline-black disabled:bg-[#D7D7D7] disabled:text-[#f4f4f4] disabled:hover:opacity-100 dark:bg-white dark:text-black dark:focus-visible:outline-white disabled:dark:bg-token-text-quaternary dark:disabled:text-token-main-surface-secondary"
                        >
                            {processed ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-lg"><rect width="10" height="10" x="7" y="7" fill="currentColor" rx="1.25" data-darkreader-inline-fill="" ></rect></svg>
                                : <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    fill="none"
                                    viewBox="0 0 32 32"
                                    className="icon-2xl"
                                >
                                    <path
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>}
                        </button>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </div>
        </div>
    );
}

