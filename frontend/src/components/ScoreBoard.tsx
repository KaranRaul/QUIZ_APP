import React, { useEffect, useState } from 'react'
import { socket } from '../App'
const ScoreBoard = ({ msg }: { msg: string }) => {
    const [leaderboard, setLeaderboard] = useState<any>(null);

    useEffect(() => {
        socket.on('scores', (scores) => {
            console.log(scores);
            const sorted = scores.sort((a: any, b: any) => b.points - a.points);
            setLeaderboard(sorted);
        })
    })
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{msg}</h2>
            {leaderboard && leaderboard.map((user: any) => (
                <div key={user.name} className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <h3 className="text-lg font-bold mb-2">{user.name}</h3>
                    <p className="text-gray-600">Score: {user.points}</p>
                </div>
            ))}
        </div>
    )
}

export default ScoreBoard
