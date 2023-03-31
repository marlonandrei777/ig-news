import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages';

jest.mock('next/router')
jest.mock('next-auth/client', () => {
    return {
        useSession: () => [null, false]
    }
})

//mocando o stripe
jest.mock('../../services/stripe')

describe('Home Page', () => {
    it('renders correctly', () => {

        render(<Home product={{ priceId: 'Fake-price-id', amount: 'R$10,00' }} />)

        expect(screen.getByText("for R$10,00 month")).toBeInTheDocument()

    })

    // Testando o getStaticProps se a pagina esta carregando os dados iniciais
    it('loads initial data', async () => {
        const retriveStripePricesMocked = mocked(stripe.prices.retrieve)

        /* para fucoes async como esta q esta dentro do componente, ustilizamos
        o mockResolveValueOnce. e vamos retornar de dentro dela o price id e
        o unitAmounth. as any para parar de reclamar da tipagem pq essa funcao
        recebe mais props, mas so vamos usar o id e o unit_amount*/
        retriveStripePricesMocked.mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000,
        } as any)

        const response = await getStaticProps({})

        /* Validacao quando esperamos q um objeto dentro da resposta tenha
        tais informacoes. */
        /* entao eu espero q a minha resposta seja igual a um objeto contendo
        as seguintes props: */
        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    product: {
                        priceId: 'fake-price-id',
                        amount: '$10.00'
                    }
                }
            })
        )
    })
})