import React, { useEffect, useState } from 'react'
import { socket } from '../App'
import { useAsyncError, useSearchParams } from 'react-router-dom'
const ScoreBoard = () => {
    const [leaderboard, setLeaderboard] = useState<any>(null);

    useEffect(() => {
        socket.on('leaderboard', (leaderboard: any) => {
            console.log(leaderboard)
            setLeaderboard(leaderboard);
        })
    })
    return (
        <div>
            quiz ENded
            {leaderboard && leaderboard.map((user: any) => {
                return <div id={user.name}>
                    {user.name} with points {user.points}
                </div>
            })}
        </div>
    )
}

export default ScoreBoard
