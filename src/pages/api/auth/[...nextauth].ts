import { query as q } from 'faunadb';

import NextAuth from 'next-auth';
import { session } from 'next-auth/client';
import Providers from 'next-auth/providers';

import { fauna } from '../../../services/fauna';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRETE,
      scope: 'read:user'
    }),
  ],
  /* jwt: {
    signingKey: process.env.SIGNING_KEY,
  }, */
  callbacks: {
    async session(session) {
      try {
        const UserActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )
        
        return {
          ...session,
          activeSubscription: UserActiveSubscription
        };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },

    async signIn(user, account, profile) {
      const { email } = user

      // inserindo informação no bd
      try {
        await fauna.query(
          // condicional fauna
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email) // normaliza o case do email p fica lowercase
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            // se o usuario existe (else)
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email) 
              )
            )
          )
        )

        return true
      } catch {
        return false
      }

      
    },
  }
})