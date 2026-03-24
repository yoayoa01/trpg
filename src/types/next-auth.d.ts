import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      authProvider?: string | null;
    };
  }

  interface User {
    authProvider?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    authProvider?: string;
  }
}