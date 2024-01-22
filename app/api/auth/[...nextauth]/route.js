// import NextAuth from "next-auth/next";
// import GoogleProvider from 'next-auth/providers/google';
// import User from "@models/user";
// import { connectToDB } from "@utils/database";

// const handler = NextAuth({
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         })
//     ],
//     async session({session}){
//         const sessionUser = await User.findOne({
//             email: session.user.email
//         })

//         session.user.id = sessionUser._id.toString();

//         return session;
//     },
//     async sigIn({profile}){
//         try {
//             await connectToDB();

//check if the user is already exist
// const userExists = await User.findOne({
//     email: profile.email
// });

// if a user doesnot exist
//         if(!userExists){
//             await User.create({
//                 email: profile.email,
//                 username: profile.name.replace(" ", "").toLowerCase(),
//                 image: profile.picture
//             })
//         }
//         } catch (error) {
//           console.log(error);
//           return false;
//         }
//     }
// })

// export {handler as GetAnimationsOptions, handler as POST};

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: "openid profile email",
    }),
  ],
  session: {
    jwt: true, // Enable JSON Web Tokens (JWT)
    maxAge: 30 * 24 * 60 * 60, // Set the maximum age of the JWT (in seconds)
    updateAge: 24 * 60 * 60, // Update JWT if session is older than specified seconds
  },
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();
    
        // Extract the name from the Google profile
        const googleName = profile.name;
    
        // Generate a valid and unique username
        const generateUsername = () => {
          // Ensure the username is between 8 and 20 characters
          let username = googleName.replace(/\s+/g, '').toLowerCase();
    
          // Trim the username to be between 8 and 20 characters
          username = username.slice(0, Math.min(20, Math.max(8, username.length)));
    
          // You may want to add a unique identifier to ensure uniqueness
          // For example, you can append a timestamp or a random string
          return `${username}_${Date.now()}`;
        };
    
        // Check if the user already exists
        const userExists = await User.findOne({ email: profile.email });
    
        // If not, create a new document and save the user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: generateUsername(),
            image: profile.picture,
          });
        }
    
        return true;
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };

