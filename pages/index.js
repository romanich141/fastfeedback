import Head from 'next/head'
import { useAuth } from '../lib/auth'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { isDisabledUser, user, signinWithGitHub, signout } = useAuth();
  console.log(isDisabledUser);
  return (
    <div className={styles.container}>
      <Head>
        <title>fastlu feedback</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>
        <div>
          { user?.email }
        </div>
        { user 
          ? <button onClick={signout}>Sign out</button> 
          : <button onClick={signinWithGitHub}>Sign in</button> 
        }
      </main>
    </div>
  )
}
