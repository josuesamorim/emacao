import Head from 'next/head'

import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import { ChallengeBox } from "../components/ChallengeBox";

import styles from '../styles/Pages/Home.module.css';
import { CountdownProvider } from '../contexts/CountdownContext';
import { ChallengeProvider } from '../contexts/ChallengeContext';
import { GetServerSideProps } from 'next';
import { prependOnceListener } from 'process';


interface HomeProps{
  level: number;
  currentExperience: number;
  challengeCompleted: number;

}

export default function Home(props){

    return(
    <ChallengeProvider level={props.level} 
    currentExperience={props.currentExperience}
    challengeCompleted={props.challengeCompleted}>
        <div className={styles.container}>

          <Head>
            <title>Inicio | Em Ação</title>
          </Head>

        <ExperienceBar />

        <CountdownProvider>
        <section>

        <div>
        <Profile />
        <CompletedChallenges />
        <Countdown />
        
        </div>

        <div>
        <ChallengeBox />
        </div>

        </section>
        </CountdownProvider>

      </div>
      </ChallengeProvider>
    )
}

export const getServerSideProps : GetServerSideProps = async (ctx) => {
const {level, currentExperience, challengeCompleted} = ctx.req.cookies;

return{
  props: {
    level: Number(level),
    currentExperience: Number(currentExperience),
    challengeCompleted: Number(challengeCompleted),
  }
}
}