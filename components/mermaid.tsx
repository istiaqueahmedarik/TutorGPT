'use client';
import React, { useEffect } from "react";
import Markdown from "react-markdown";

export interface MermaidProps {
    text: string;
}

function mm(graph: string): string {
    let graphBytes: Buffer = Buffer.from(graph, 'utf8');
    let base64Bytes: string = graphBytes.toString('base64');
    return "https://mermaid.ink/img/" + base64Bytes;
}

export const Mermaid: React.FC<MermaidProps> = ({ text }) => {
    const imageUrl = mm(text);

    return (
        <p>
            <Markdown>{`![Mermaid Diagram](${imageUrl})`}</Markdown>
        </p>
    );
};
