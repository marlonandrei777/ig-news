import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

const posts = [
    {
        slug: 'my-new-post',
        title: ' My New Post',
        excerpt: 'Post excerpt',
        updatedAt: '10 de Abril'
    }
];

jest.mock('../../services/prismic')

describe('Posts Page', () => {
    it('renders correctly', () => {

        render(<Posts posts={posts} />)

        expect(screen.getByText("My New Post")).toBeInTheDocument()

    })

    // Testando o getStaticProps se a pagina esta carregando os dados iniciais
    it('loads initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        /* para fucoes async como esta q esta dentro do componente, ustilizamos
        o mockResolveValueOnce. e vamos retornar de dentro dela as
        propriedades a baixo. as any para parar de reclamar da tipagem pq essa funcao
        recebe mais props, mas so vamos usar o uid, data e o last_publication_date*/
        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-new-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'My new post' }
                            ],
                            content: [
                                { type: 'paragraph', text: 'Post excerpt' }
                            ],
                        },
                        last_publication_date: '04-01-2021',
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({})

        /* Validacao quando esperamos q um objeto dentro da resposta tenha
        tais informacoes. */
        /* entao eu espero q a minha resposta seja igual a um objeto contendo
        as seguintes props: */
        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: 'My new post',
                        excerpt: 'Post excerpt',
                        updatedAt: '01 de abril de 2021'
                    }]
                }
            })
        )
    })
})