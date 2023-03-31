import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';

import Prismic from '@prismicio/client';

import styles from './styles.module.scss';
import Link from 'next/link';

type Posts = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}

interface PostProps {
    posts: Posts[]
}

export default function Posts({ posts }: PostProps) {
    return (
        <>
            <Head>
                <title>Post | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Link key={post.slug} href={`/posts/${post.slug}`}>
                            <a>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient()

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'post')
    ], {
        // quais dados eu quero buscar da publicação
        fetch: ['post.title', 'post.content'],
        pageSize: 100,
    })


    // results: resultados de posts q vieram
    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            })
        };
    })

    return {
        props: {
            posts
        }
    }
}
