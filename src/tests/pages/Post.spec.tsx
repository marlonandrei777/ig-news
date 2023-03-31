import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession } from 'next-auth/client';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
    slug: 'my-new-post',
    title: ' My New Post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de Abril'
}

jest.mock('next-auth/client')
jest.mock('../../services/prismic')

describe('Post Page', () => {
    // teste para ver o titulo do post e o conteudo do post
    it('renders correctly', () => {

        render(<Post post={post} />)

        expect(screen.getByText("My New Post")).toBeInTheDocument()
        expect(screen.getByText("Post excerpt")).toBeInTheDocument()

    })

    it('redircts user if no subscription is found', async () => {
        // mocando para retornar q o usuaio n está logado
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            },
        } as any)

        /* Validacao quando esperamos q um objeto dentro da resposta tenha
        tais informacoes. */
        /* entao eu espero q a minha resposta seja igual a um objeto contendo
        as seguintes props: */
        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/'
                })
            })
        )
    });

    // testando se os dados estao sendo carregados caso o usuario esteja autenticado
    it('load iitial data', async () => {
        const getSessionMocked = mocked(getSession)
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'My new post' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post content' }
                    ],
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        // vai retornar se o usuario esta autenticado
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            },
        } as any)

        // espero q o retorno tenha...
        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My new post',
                        content: '<p>Post content</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )
    })
})