"use client";

import { useState } from "react";
import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useQuery,
} from "convex/react";
import { authClient } from "@/lib/auth-client";
import { api } from "../convex/_generated/api";

export default function App() {
  return (
    <>
      <AuthLoading>
        <div>Loading...</div>
      </AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
      </Authenticated>
    </>
  );
}

function Dashboard() {
  const user = useQuery(api.auth.getCurrentUser);
  return (
    <div>
      <div>Hello {user?.name}!</div>
      <button onClick={() => authClient.signOut()}>Sign out</button>
    </div>
  );
}

function SignIn() {
  const [showSignIn, setShowSignIn] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (showSignIn) {
      await authClient.signIn.email(
        {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        },
        {
          onError: (ctx) => {
            window.alert(ctx.error.message);
          },
        }
      );
    } else {
      await authClient.signUp.email(
        {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        },
        {
          onError: (ctx) => {
            window.alert(ctx.error.message);
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {showSignIn ? "Sign in to your account" : "Create your account"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!showSignIn && (
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showSignIn ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {showSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setShowSignIn(!showSignIn)}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {showSignIn ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}