import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from './styles.module.scss';

export function SignInButton() {
    // autentication
    const { data } = useSession();

    // o return já é algo condicional
    return data ? (
        <button
            className={styles.signInButton}
            type="button"
            onClick={() => signOut()}
        >
            <FaGithub color="#04d361" />
            {data.user.name}
            <FiX color="#737380" margin-left="1rem" />
        </button>

    ) : (
        <button
            className={styles.signInButton}
            type="button"
            onClick={() => signIn('github')}
        >
            <FaGithub color="#eba417" />
            Sign in with GitHub
        </button>
    );
}