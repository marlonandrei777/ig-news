import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss';

export function SignInButton() {
    const isUserLoggedIn = true;

    // o return já é algo condicional
    return isUserLoggedIn ? (
        <button
            className={styles.signInButton}
            type="button"
        >
            <FaGithub color="#04d361" />
            Marlon Andrei
            <FiX color="#737380" className={styles.closeIcon} />
        </button>

    ) : (
        <button
            className={styles.signInButton}
            type="button"
        >
            <FaGithub color="#eba417" />
            Sign in with GitHub
        </button>
    );
}