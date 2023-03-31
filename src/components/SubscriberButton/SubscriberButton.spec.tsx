import { render, screen, fireEvent } from "@testing-library/react";
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'jest-mock'
import { SubscriberButton } from ".";

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscriberButton Component', () => {
    /* quando renderizar o botao eu espero q apareça Subscribe now */
    it('renders correctly', () => {
        /* moc para o Usuario esteja deslogado */
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<SubscriberButton />)

        expect(screen.getByText('Subscribe now')).toBeInTheDocument()
    })

    /* espero q o botao redirecione o usuario para pagina de signin quando
    ele nao estiver autenticado */
    it('redirect user to sign in when not authenticated', () => {
        /* mocando a funcao signin */
        const signInMocked = mocked(signIn)
        /* moc para o Usuario esteja deslogado */
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<SubscriberButton />)

        const subscribeButton = screen.getByText('Subscribe now')

        /* Simulacao de click no botao subscribe Now */
        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()
    })

    /* espero q o usuario seja redirecionado para a tela de posts
    quando ele tiver uma subscription ativa */
    it('redirects to posts when user already has a subscription', () => {
        // mocando o nextRouter
        const useRouterMocked = mocked(useRouter)
        const useSessionMocked = mocked(useSession)
        // forma de conseguir observar se uma funcao foi disparada  ou n
        const pushMock = jest.fn();

        // vai retornar como se tivesse um usuario logado
        useSessionMocked.mockReturnValueOnce([
            {
                user: {
                    name: 'John Doe',
                    email: 'john.doe@exemple.com'
                },
                activeSubscription: 'fake-active-subscription',
                expires: 'fake-expires'
            },
            false
        ])

        // quando a funcao use router for chamada eu quero q o retorno dela seja:
        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any) // as any para o ts parar de reclamar

        render(<SubscriberButton />)

        const subscribeButton = screen.getByText('Subscribe now')

        /* Simulacao de click no botao subscribe Now */
        fireEvent.click(subscribeButton)

        // espero q a funcao foi chamada enviado o parametro /post
        expect(pushMock).toHaveBeenCalledWith('/posts')
    })
})