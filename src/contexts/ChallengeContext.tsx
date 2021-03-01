import {createContext, ReactNode, useEffect, useState} from 'react';
import challenges from '../../challenges.json';
import { CompletedChallenges } from '../components/CompletedChallenges';
import {} from '../components/Countdown'
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';

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
    resetChallenge: () => void;
    completeChallenge: () => void
    closeLevelUpModal: () => void}
    

interface challengeProviderProps{
    children: ReactNode; 
        level: number;
        currentExperience: number;
        challengeCompleted: number;
}

export const ChallengeContext = createContext ({} as challengeContextData);

export function ChallengeProvider({children,
...rest
}:challengeProviderProps){

    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengeCompleted, setChallengeCompleted] = useState(rest.challengeCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null)

    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level +  1) * 4, 2);
    
    useEffect(() => {
        Notification.requestPermission();
    },[]);
    

    function levelUp(){
    setLevel(level + 1);
    setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal(){
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge(){
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge)

    new Audio(`/notification.mp3`).play();

    if (Notification.permission === 'granted'){
        new Notification('Novo desafio',{
            body: `Valendo ${challenge.amount}xp!`
        })
    }
    }

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengeCompleted', String(challengeCompleted));
        }, [level, currentExperience, challengeCompleted]);
    

    function resetChallenge(){
        setActiveChallenge(null);

    }

    function completeChallenge(){
        if (!activeChallenge){
            return;
        }

    const {amount} = activeChallenge;

    let finalExperience = currentExperience + amount;

    if (finalExperience >= experienceToNextLevel){
        finalExperience = finalExperience - experienceToNextLevel;
        levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengeCompleted(challengeCompleted + 1);

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
         experienceToNextLevel,
         completeChallenge,
         closeLevelUpModal}}>
        {children}
        { isLevelUpModalOpen && <LevelUpModal/>}
        </ChallengeContext.Provider>
    );
}
#