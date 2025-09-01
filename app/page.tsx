import Link from "next/link";


export default function Home() {
return (
     <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:grid">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
           Interview Test App
        </h1>
        <div className="flex gap-4">
            <Link href="/login">
                <button className="font-medium  rounded text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                    Login
                </button>
             </Link>
            <Link  
              href="/register">
                <button className="font-medium text-blue-600 rounded hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                  Register
                </button>
            </Link>
        </div>
      </div>
    </main>
);
}