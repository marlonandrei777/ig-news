import { render } from "@testing-library/react";
import { ActiveLink } from ".";

// mock= imitando o funcionamento do next/router (useRouter)
/* toda vez que algum componente utilizar o nextRouter vamos falar oq o
nextRouter vai retornar */
jest.mock('next/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            }
        }
    }
})

/* quando temos varios testes no mesmo componente , colocamos os testes
dentro de uma cessao chamada describe q vai criar uma categorizacao nos
testes */
describe('ActiveLink Component', () => {
    /* nesse teste vamos verificar se o active link esta
    renderizando de forma correta. Podemos colocar no lugar do it
    a palavra test */
    it('renders correctly', () => {
        const { getByText, debug } = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )

        // funciona como se fosse um console.log
        debug()

        expect(getByText('Home')).toBeInTheDocument()
    })

    // Testar se o component ActiveLink esta recebendo a classe active
    it('add active class if the link as currently active', () => {
        const { getByText } = render(
            <ActiveLink href="/" activeClassName="active">
                <a>Home</a>
            </ActiveLink>
        )

        // espero q o componente home tenha uma classe active
        expect(getByText('Home')).toHaveClass('active')
    })
})

