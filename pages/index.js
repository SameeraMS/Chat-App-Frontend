import Chat from '../components/Chat.js';

export default function Home() {
    return (
        <div>
            <style jsx global>{`
                body {
                    font-family: Arial, sans-serif;
                    background-color: #d1fffd;
                    margin: 0;
                    padding: 0;
                }
            `}</style>
            <Chat />
        </div>
    );
}
