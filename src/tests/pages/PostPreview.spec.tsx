import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
    slug: 'my-new-post',
    title: ' My New Post',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de Abril'
}

jest.mock('next-auth/client')
jest.mock('next/router')
jest.mock('../../services/prismic')

describe('Post preview Page', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession)

        /* para dizer q o usuario n esta autenticado */
        useSessionMocked.mockReturnValueOnce([null, false])

        render(<Post post={post} />)

        expect(screen.getByText("My New Post")).toBeInTheDocument()
        expect(screen.getByText("Post excerpt")).toBeInTheDocument()
        expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()

    })

    /* se redireciona o usuario pro post completo caso ele ja esteja inscrito */
    it('redircts user to full post when user is subscribed', async () => {
        const useSessionMocked = mocked(useSession)
        const useRouterMocked = mocked(useRouter)
        // para saber se a funcao foi chamada ou nao, fizemos o mock da funcao push
        const pushMock = jest.fn()

        /* para dizer q o usuario esta autenticado */
        useSessionMocked.mockReturnValueOnce([
            { activeSubscription: 'fake-active-subscription' },
            false
        ] as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMock,
        } as any)

        render(<Post post={post} />)

        // espero q a funcao pushmock tenha sido chamada com o paramtreo('/posts....')
        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    });

    // testando se os dados estao sendo carregados caso o usuario esteja autenticado
    it('load iitial data', async () => {
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

        const response = await getStaticProps({ params: { slug: 'my-new-post' } })

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