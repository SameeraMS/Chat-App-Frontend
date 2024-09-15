import Chat from '../components/Chat.js';

export default function Home() {
    return (
        <div>
            <style jsx global>{`
                body {
                    font-family: Arial, sans-serif;
                    background-color: #272931;
                    margin: 0;
                    padding: 0;
                }
            `}</style>
            <Chat />
        </div>
    );
}
