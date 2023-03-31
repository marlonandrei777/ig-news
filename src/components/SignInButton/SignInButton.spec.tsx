import { render, screen } from "@testing-library/react";
import { useSession } from 'next-auth/client';
import { mocked } from 'jest-mock'
// importação do componente q vai ser testado
import { SignInButton } from ".";

jest.mock('next-auth/client')

describe('SignInButton Component', () => {
    /* nesse teste vamos verificar se o button sign in with github esta em tela */
    it('renders correctly when user is not authenticated', () => {
        /* quando precisamos q a funcao do mock tenha um retorno diferente
        para um dos testes utilizamos mocked */
        const useSessionMocked = mocked(useSession)

        /* once é para mockar o proximo retorno o primeiro retorno dessa funcao
        dps dessa linha.  entao é valido apenas para esse teste */
        useSessionMocked.mockReturnValueOnce([null, false])

        render(<SignInButton />)

        expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument()
    })

    /* nesse teste vamos verificar se o button sign in with github esta em tela
    mas com o nome do usuario do github autenticado  */
    it('renders correctly when user is authenticated', () => {
        const useSessionMocked = mocked(useSession)

        /* a qui ja passamos um objeto fake pro mock para testar se o botao
        renderiza quando tem usuario autenticado */
        useSessionMocked.mockReturnValueOnce([
            { user: { name: 'John Doe', email: 'john.doe@exemple.com' }, expires: 'fake-expires' },
            false
        ])

        render(<SignInButton />)

        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
})