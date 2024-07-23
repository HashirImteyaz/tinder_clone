'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Neo4jUser } from '@/types'
import * as React from  'react'
import TinderCard from 'react-tinder-card'
import { neo4jSwipe } from '../neo4j.action';

interface HomePageClientComponentProps{
    currentUser: Neo4jUser;
    users: Neo4jUser[];
}

const HomePageClientComponent: React.FC<HomePageClientComponentProps>=({
    currentUser,
    users,
})=> {
    const handleSwipe=async (direction: string, userId:string)=>{
        const isMatch= await neo4jSwipe(
            currentUser.applicationId,
            direction,
            userId
        );
        if (isMatch) alert ('Congrats! Its a match' );
    }

    return ( <div className='w-screen h-screen flex justify-center items-center'>
        <div>
        <div>
            <h1 className='text-4xl'>Hello {currentUser.firstname} {currentUser.lastname} </h1>
        </div>
        <div className='mt-4 relative'>
           {users.map((user)=>(
                <TinderCard onSwipe={(direction: String)=> handleSwipe(direction, user.applicationId)} className='absolute' key={user.applicationId}>
                   <Card>
                        <CardHeader>
                            <CardTitle>{user.firstname}  {user.lastname}</CardTitle>
                            <CardDescription> {user.email}</CardDescription>
                        </CardHeader>
                        </Card>
                </TinderCard>
        ))}
        </div>
    </div>
    </div>
    )
};
export default HomePageClientComponent;
