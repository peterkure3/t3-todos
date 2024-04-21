import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const Header = () => {
  const { data: session } = useSession();

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-white border-b border-gray-300">
      <div className="text-xl font-bold">TODO APP</div>

      <div className="flex flex-row gap-2">
        { session?.user ? (
          <div className="flex flex-row items-center gap-2">
            <p className="text-lg">{ session.user.name }</p>
            <button onClick={() => void signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Sign Out</button>
          </div>
        ) : (
          <button onClick={() => void signIn()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">Sign In</button>
        )}
      </div>
    </div>
  )
}
