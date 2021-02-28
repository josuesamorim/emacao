import {createContext, ReactNode, useState} from 'react';
import challenges from '../../challenges.json';
import {} from '../components/Countdown'


interface challenge{
type: 'body' | 'eye';
description: string;
amount: number;
}

interface challengeContextData{
    level: number;
    currentExperience: number; 
    challengeCompleted: number;
    experienceToNextLevel: number;
    activeChallenge: challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;}
    

interface challengeProviderProps{
    children: ReactNode; 
}

export const ChallengeContext = createContext ({} as challengeContextData);

export function ChallengeProvider({children}:challengeProviderProps){

    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengeCompleted, setChallengeCompleted] = useState(0);

    const [activeChallenge, setActiveChallenge] = useState(null)

    const experienceToNextLevel = Math.pow((level +  1) * 4, 2);
    
    
    function levelUp(){
    setLevel(level + 1);
    }

    function startNewChallenge(){
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge)
    }

    function resetChallenge(){
        setActiveChallenge(null);

    }

    return(


        <ChallengeContext.Provider value={{
        level,
         currentExperience, 
         challengeCompleted, 
         levelUp,
         startNewChallenge,
         activeChallenge,
         resetChallenge,
         experienceToNextLevel,}}>
        {children}
        </ChallengeContext.Provider>
    );
}