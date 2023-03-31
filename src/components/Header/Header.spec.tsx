// screen =  primeira forma mais facil de testar se elementos estao em tela
import { render, screen } from "@testing-library/react";
// importação do componente q vai ser testado
import { Header } from ".";

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

/* sempre q estamos escrevendo testes unitarios e o nosso compoente depende
de algo externo de uma biblioteca de algo q nao vai funcionar necessariamente
dentro do TextDecoderStream, fazemos o mock e mocamos o funcionamento da quilo
botando um retorno ficticio para a quela funcao */
jest.mock('next-auth/client', () => {
    return {
        useSession() {
            return [null, false]
        }
    }
})

/* quando temos varios testes no mesmo componente , colocamos os testes
dentro de uma cessao chamada describe q vai criar uma categorizacao nos
testes */
describe('Header Component', () => {
    /* nesse teste vamos verificar se dentro do header temos um link com
    Home e outro com Posts */
    it('renders correctly', () => {
        render(
            <Header />
        )

        /* Cria um playground onde conseguimos ver todo o html gerado do
        componente header q estamos testando. Além de facilitar de como 
        selecionar e encontrar um elemento em tela*/
        screen.logTestingPlaygroundURL()

        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Posts')).toBeInTheDocument()
    })
})

